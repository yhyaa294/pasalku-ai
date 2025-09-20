import json
from byteplus.ark.ark import Ark
from ..core.config import settings
from .. import schemas

# Initialize BytePlus Ark client according to the new documentation
client = Ark(
    api_key=settings.ARK_API_KEY,
    base_url=settings.ARK_BASE_URL
)

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
    """
    try:
        # Send chat completion request to the model
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
        raise Exception("Failed to get response from AI service.")
