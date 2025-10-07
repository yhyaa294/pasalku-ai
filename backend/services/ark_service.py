"""
Service for interacting with BytePlus Ark AI
"""
import os
import logging
from typing import Dict, List, Optional
from byteplussdkarkruntime import Ark
from backend.core.config import settings

logger = logging.getLogger(__name__)

class ArkService:
    def __init__(self):
        self.api_key = settings.ARK_API_KEY
        self.base_url = settings.ARK_BASE_URL
        self.model_id = settings.ARK_MODEL_ID
        self.region = "ap-southeast"  # Default region for BytePlus Ark
        
        if not self.api_key:
            logger.warning("ARK_API_KEY is not set. ArkService will not be available.")
            self.client = None
        else:
            try:
                self.client = Ark(
                    api_key=self.api_key,
                    base_url=self.base_url,
                    region=self.region
                )
                logger.info("Successfully initialized BytePlus Ark client")
            except Exception as e:
                logger.error(f"Failed to initialize BytePlus Ark client: {str(e)}")
                self.client = None
    
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = 2000,
        **kwargs
    ) -> Dict:
        """
        Send a chat completion request to BytePlus Ark
        
        Args:
            messages: List of message dictionaries with 'role' and 'content'
            temperature: Controls randomness (0.0 to 1.0)
            max_tokens: Maximum number of tokens to generate
            **kwargs: Additional parameters for the API
            
        Returns:
            Dict containing the API response
        """
        if not self.client:
            return {
                "error": "BytePlus Ark client is not initialized. Check your ARK_API_KEY.",
                "success": False
            }
            
        try:
            response = self.client.chat.completions.create(
                model=self.model_id,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                **kwargs
            )
            
            # Convert response to dict for easier handling
            return {
                "success": True,
                "response": response.choices[0].message.content if hasattr(response, 'choices') else "",
                "raw_response": response.dict() if hasattr(response, 'dict') else str(response)
            }
            
        except Exception as e:
            logger.error(f"Error in ArkService.chat_completion: {str(e)}", exc_info=True)
            return {
                "error": f"Failed to get completion: {str(e)}",
                "success": False
            }

# Singleton instance
ark_service = ArkService()
