# Factory untuk membuat instance AI service berdasarkan provider
def create_ai_service(provider: str = "byteplus") -> BaseAIService:
    """
    Factory function untuk membuat instance AI service

    Args:
        provider: Nama provider AI ("byteplus", "groq", "multi", "advanced")

    Returns:
        Instance dari BaseAIService
    """
    if provider == "byteplus":
        return BytePlusArkService()
    elif provider == "groq":
        return GroqAIService()
    elif provider == "multi":
        return AdvancedAIService()
    else:
        raise ValueError(f"Provider AI tidak dikenal: {provider}")

# Instance global default (BytePlus)
ai_service = create_ai_service("byteplus")

# Advanced service instance
advanced_ai_service = create_ai_service("multi")