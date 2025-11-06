import json
from core.config import settings
import schemas

# Initialize BytePlus Ark client with proper imports that work with the installed SDK
try:
    # Try the working import from ai_service.py
    from byteplussdkarkruntime import Ark
    ark_available = True
except ImportError:
    try:
        # Alternative import
        from byteplus.ark.ark import Ark
        ark_available = True
    except ImportError:
        ark_available = False
        Ark = None

# Only initialize client if SDK is available and API key is configured
if ark_available and settings.ARK_API_KEY and Ark:
    try:
        client = Ark(
            api_key=settings.ARK_API_KEY,
            base_url=settings.ARK_BASE_URL,
            region="ap-southeast"
        )
        ark_initialized = True
    except Exception as e:
        print(f"Failed to initialize BytePlus Ark: {e}")
        ark_initialized = False
else:
    client = None
    ark_initialized = False

AI_CONSTITUTION = """
You are an empathetic legal assistant for Pasalku.ai in Indonesia. Your primary role is to provide clear, easy-to-understand legal information based on Indonesian law. You must adhere to the following rules strictly:
1.  **NEVER PROVIDE LEGAL ADVICE.** Do not tell the user what they should do. Instead, explain the relevant legal concepts and regulations.
2.  **ALWAYS INCLUDE CITATIONS.** For every legal point you make, you must cite the specific law and article number (e.g., "Pasal 378 KUHP").
3.  **ALWAYS INCLUDE A DISCLAIMER.** At the end of every response, include the following disclaimer: "Informasi ini bukan merupakan nasihat hukum. Untuk nasihat hukum yang spesifik, harap konsultasikan dengan profesional hukum yang berkualifikasi."
4.  **ALWAYS RESPOND IN JSON FORMAT.** Your final output must be a single, valid JSON object with three keys: "answer", "citations", and "disclaimer". The "citations" key must be a list of strings.
"""

def get_ai_response(query: str) -> schemas.ChatResponse:
    """
    Sends a query to the BytePlus AI model with the AI Constitution and returns a structured response.
    Falls back gracefully if AI is not available.
    """
    if not ark_initialized or not client:
        # Fallback response when AI is not available
        return schemas.ChatResponse(
            answer="Maaf, layanan AI sedang tidak tersedia saat ini. Mohon coba lagi nanti.",
            citations=[],
            disclaimer="Informasi ini bukan merupakan nasihat hukum. Untuk nasihat hukum yang spesifik, harap konsultasikan dengan profesional hukum yang berkualifikasi."
        )

    try:
        completion = client.chat.completions.create(
            model=settings.ARK_MODEL_ID,
            messages=[
                {
                    "role": "system",
                    "content": AI_CONSTITUTION,
                },
                {
                    "role": "user",
                    "content": query,
                },
            ],
            temperature=0.7,
            top_p=0.9,
        )

        # Extract the JSON content from the response
        response_content = completion.choices[0].message.content

        # Parse the JSON string into a Python dictionary
        response_data = json.loads(response_content)

        # Validate and structure the response using Pydantic schema
        return schemas.ChatResponse(**response_data)

    except json.JSONDecodeError:
        # Handle cases where the AI response is not valid JSON
        return schemas.ChatResponse(
            answer="Maaf, terjadi kesalahan saat memproses jawaban dari AI. Silakan coba lagi.",
            citations=[],
            disclaimer="Informasi ini bukan merupakan nasihat hukum. Untuk nasihat hukum yang spesifik, harap konsultasikan dengan profesional hukum yang berkualifikasi."
        )
    except Exception as e:
        # Handle other potential errors (API issues, etc.)
        print(f"An error occurred: {e}") # For logging/debugging
        return schemas.ChatResponse(
            answer="Terjadi kesalahan saat menghubungi layanan AI. Mohon coba lagi nanti.",
            citations=[],
            disclaimer="Informasi ini bukan merupakan nasihat hukum. Untuk nasihat hukum yang spesifik, harap konsultasikan dengan profesional hukum yang berkualifikasi."
        )

# Define the AIConsultationAgent class that the consultation router expects
class AIConsultationAgent:
    """AI Agent for Legal Consultation Sessions"""

    def __init__(self):
        self.ai_initialized = ark_initialized and ark_available

    async def generate_greeting(self, category):
        """Generate initial AI greeting for consultation session"""
        try:
            if not self.ai_initialized:
                return f"Halo! Saya adalah AI konsultasi hukum umum. Mari kita bahas masalah {category.value if hasattr(category, 'value') else category} Anda."

            # Use AI to generate personalized greeting
            prompt = f"""
            Buat salam perkenalan yang ramah dan profesional untuk konsultasi hukum tentang kategori: {category.value if hasattr(category, 'value') else category}.

            Kondisi: Konsultasi dimulai, beri sapaan hangat dan jelaskan bahwa ini informasi umum, bukan nasihat hukum.
            """

            ai_response = await get_ai_response(prompt)
            return ai_response.answer

        except Exception as e:
            print(f"Failed to generate greeting: {str(e)}")
            return f"Halo! Saya adalah AI konsultasi hukum umum. Mari kita bahas masalah {category.value if hasattr(category, 'value') else category} Anda."

    async def generate_response(self, message, history, category):
        """Generate AI response in consultation context"""
        try:
            if not self.ai_initialized:
                return f"Maaf, layanan AI sedang tidak tersedia. Pertanyaan Anda tentang: {message} akan dicatat untuk ditinjau manual."

            # Build conversation context
            context = f"Kontek perkategori hukum: {category.value if hasattr(category, 'value') else category}\n"
            context += f"Pertanyaan pengguna: {message}\n"
            context += "Berikan jawaban informatif dan jelas dalam bahasa Indonesia."

            ai_response = await get_ai_response(context)
            return ai_response.answer

        except Exception as e:
            print(f"Failed to generate response: {str(e)}")
            return f"Terjadi kesalahan dalam memproses pertanyaan Anda tentang: {message}. Mohon coba lagi atau berkonsultasi dengan profesional hukum."

    def hash_pin(self, pin):
        """Hash PIN for session protection"""
        import hashlib
        import secrets
        salt = secrets.token_hex(16)
        hashed = hashlib.sha256(f"{pin}{salt}".encode()).hexdigest()
        return f"{salt}:{hashed}"
