import logging
import os
import asyncio
from typing import Optional, Dict, Any
from functools import lru_cache
from pathlib import Path
import httpx
from dotenv import load_dotenv

# Load environment variables from project root
project_root = Path(__file__).parent.parent.parent
env_path = project_root / ".env"
if env_path.exists():
    load_dotenv(env_path)

logger = logging.getLogger(__name__)

class TranslationService:
    """Multi-provider translation service with intelligent fallback.
    
    Primary language: Indonesian (id)
    Supported regional languages: Javanese (jv), Sundanese (su), Balinese (ban), Minangkabau (min), etc.
    
    Provider cascade:
    1. Google Cloud Translate (highest quality, best coverage)
    2. DeepL (excellent quality, limited language coverage)
    3. Groq AI (prompt-based translation, flexible but slower)
    4. Identity (development fallback)
    """
    
    def __init__(self):
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        self.google_credentials = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        self.deepl_api_key = os.getenv("DEEPL_API_KEY")
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        
        # Determine available providers
        self.providers = []
        if self.google_api_key or self.google_credentials:
            self.providers.append("google")
        if self.deepl_api_key:
            self.providers.append("deepl")
        if self.groq_api_key:
            self.providers.append("groq")
        
        self.primary_provider = self.providers[0] if self.providers else "identity"
        
        logger.info(f"TranslationService initialized. Available providers: {self.providers or ['identity (dev fallback)']}, Primary: {self.primary_provider}")
    
    async def translate_to_primary(self, text: str, source_lang: str = "id") -> str:
        """Translate user input (source_lang) to primary language (id).
        
        Args:
            text: Input text from user
            source_lang: Source language code (e.g., 'jv', 'su', 'en')
        
        Returns:
            Translated text in primary language (Indonesian)
        """
        if source_lang == "id" or not text.strip():
            return text
        
        try:
            return await self._translate(text, source_lang, "id")
        except Exception as e:
            logger.error(f"Translation failed (source: {source_lang} -> id): {e}. Using original text.")
            return text
    
    async def translate_to_user(self, text: str, target_lang: str = "id") -> str:
        """Translate AI response (primary language) to target_lang.
        
        Args:
            text: AI response in primary language (Indonesian)
            target_lang: Target language code (e.g., 'jv', 'su', 'en')
        
        Returns:
            Translated text in user's language
        """
        if target_lang == "id" or not text.strip():
            return text
        
        try:
            return await self._translate(text, "id", target_lang)
        except Exception as e:
            logger.error(f"Translation failed (id -> {target_lang}): {e}. Using original text.")
            return text
    
    async def _translate(self, text: str, source_lang: str, target_lang: str, retry_count: int = 0) -> str:
        """Internal translation method with provider fallback and retry logic.
        
        Args:
            text: Text to translate
            source_lang: Source language code
            target_lang: Target language code
            retry_count: Current retry attempt
        
        Returns:
            Translated text
        """
        max_retries = 2
        
        for provider in self.providers:
            try:
                if provider == "google":
                    return await self._translate_google(text, source_lang, target_lang)
                elif provider == "deepl":
                    return await self._translate_deepl(text, source_lang, target_lang)
                elif provider == "groq":
                    return await self._translate_groq(text, source_lang, target_lang)
            except Exception as e:
                logger.warning(f"Provider {provider} failed for {source_lang}->{target_lang}: {e}")
                continue
        
        # All providers failed or no providers available
        if retry_count < max_retries:
            logger.info(f"Retrying translation (attempt {retry_count + 1}/{max_retries})")
            await asyncio.sleep(1 * (retry_count + 1))  # Exponential backoff
            return await self._translate(text, source_lang, target_lang, retry_count + 1)
        
        logger.warning(f"All translation providers failed for {source_lang}->{target_lang}. Using identity.")
        return text
    
    async def _translate_google(self, text: str, source_lang: str, target_lang: str) -> str:
        """Translate using Google Cloud Translate API."""
        if not (self.google_api_key or self.google_credentials):
            raise ValueError("Google API credentials not available")
        
        # Use REST API with API key (simpler than full client library)
        if self.google_api_key:
            url = f"https://translation.googleapis.com/language/translate/v2"
            params = {
                "key": self.google_api_key,
                "q": text,
                "source": source_lang,
                "target": target_lang,
                "format": "text"
            }
            
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(url, params=params)
                response.raise_for_status()
                data = response.json()
                
                if "data" in data and "translations" in data["data"]:
                    translated = data["data"]["translations"][0]["translatedText"]
                    logger.info(f"Google Translate: {source_lang}->{target_lang} (length: {len(text)}->{len(translated)})")
                    return translated
                else:
                    raise ValueError(f"Unexpected Google Translate response: {data}")
        else:
            # Fall back to client library if credentials file is provided
            # This requires google-cloud-translate package
            try:
                from google.cloud import translate_v2 as translate
                client = translate.Client()
                result = client.translate(text, source_language=source_lang, target_language=target_lang)
                return result["translatedText"]
            except ImportError:
                raise ValueError("google-cloud-translate not installed and no API key provided")
    
    async def _translate_deepl(self, text: str, source_lang: str, target_lang: str) -> str:
        """Translate using DeepL API."""
        if not self.deepl_api_key:
            raise ValueError("DeepL API key not available")
        
        # DeepL API endpoint
        is_free = self.deepl_api_key.endswith(":fx")
        base_url = "https://api-free.deepl.com" if is_free else "https://api.deepl.com"
        url = f"{base_url}/v2/translate"
        
        # Map language codes (DeepL uses different codes for some languages)
        deepl_source = self._map_to_deepl_code(source_lang)
        deepl_target = self._map_to_deepl_code(target_lang)
        
        headers = {
            "Authorization": f"DeepL-Auth-Key {self.deepl_api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "text": [text],
            "source_lang": deepl_source.upper(),
            "target_lang": deepl_target.upper()
        }
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(url, headers=headers, json=data)
            response.raise_for_status()
            result = response.json()
            
            if "translations" in result and len(result["translations"]) > 0:
                translated = result["translations"][0]["text"]
                logger.info(f"DeepL Translate: {source_lang}->{target_lang} (length: {len(text)}->{len(translated)})")
                return translated
            else:
                raise ValueError(f"Unexpected DeepL response: {result}")
    
    async def _translate_groq(self, text: str, source_lang: str, target_lang: str) -> str:
        """Translate using Groq AI with translation prompt."""
        if not self.groq_api_key:
            raise ValueError("Groq API key not available")
        
        # Map language codes to full names for better prompt understanding
        lang_names = {
            "id": "Indonesian",
            "jv": "Javanese",
            "su": "Sundanese",
            "ban": "Balinese",
            "min": "Minangkabau",
            "en": "English"
        }
        source_name = lang_names.get(source_lang, source_lang)
        target_name = lang_names.get(target_lang, target_lang)
        
        prompt = f"""Translate the following text from {source_name} to {target_name}. 
Provide ONLY the translation, without any explanations or additional text.

Text to translate:
{text}

Translation:"""
        
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.groq_api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "llama-3.1-70b-versatile",  # Good for multilingual tasks
            "messages": [
                {"role": "system", "content": "You are a professional translator. Provide only the translation without any additional commentary."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,  # Lower temperature for more consistent translations
            "max_tokens": len(text.split()) * 4  # Estimate tokens needed
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, headers=headers, json=data)
            response.raise_for_status()
            result = response.json()
            
            if "choices" in result and len(result["choices"]) > 0:
                translated = result["choices"][0]["message"]["content"].strip()
                logger.info(f"Groq Translate: {source_lang}->{target_lang} (length: {len(text)}->{len(translated)})")
                return translated
            else:
                raise ValueError(f"Unexpected Groq response: {result}")
    
    def _map_to_deepl_code(self, lang_code: str) -> str:
        """Map internal language codes to DeepL language codes."""
        mapping = {
            "id": "id",
            "en": "en",
            "jv": "id",  # DeepL doesn't support Javanese, fallback to Indonesian
            "su": "id",  # DeepL doesn't support Sundanese, fallback to Indonesian
            "ban": "id",  # DeepL doesn't support Balinese, fallback to Indonesian
        }
        return mapping.get(lang_code, lang_code)


# Global singleton instance
translation_service = TranslationService()

