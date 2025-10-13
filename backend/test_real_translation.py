"""
Test real translation dengan Groq API
"""
import asyncio
import sys
sys.path.insert(0, "c:\\Users\\YAHYA\\pasalku-ai-3")

async def test_groq_translation():
    """Test Groq-based translation"""
    print("\n🔥 Testing Translation with Groq API\n")
    print("=" * 60)
    
    from backend.services.translation_service import translation_service
    
    # Show config
    print(f"Available providers: {translation_service.providers}")
    print(f"Primary provider: {translation_service.primary_provider}")
    print()
    
    # Test cases
    test_cases = [
        ("id", "en", "Saya ingin konsultasi tentang hukum perdata"),
        ("id", "jv", "Bagaimana cara mengurus sertifikat tanah?"),
        ("jv", "id", "Piye carane ngurus surat-surat tanah?"),
        ("en", "id", "How do I file a lawsuit?"),
    ]
    
    for source_lang, target_lang, text in test_cases:
        print(f"\n📝 Test: {source_lang} → {target_lang}")
        print(f"Input: {text}")
        
        try:
            if source_lang == "id":
                result = await translation_service.translate_to_user(text, target_lang)
            else:
                result = await translation_service.translate_to_primary(text, source_lang)
            
            print(f"✅ Output: {result}")
            
            # Show if it's identity or real translation
            if result == text:
                print("   (Identity - no translation occurred)")
            else:
                print("   (✨ Real translation!)")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("\n✅ Translation test completed!")
    
    # Summary
    if translation_service.providers:
        print(f"\n🎉 Active providers: {', '.join(translation_service.providers)}")
        print("Translation system is OPERATIONAL")
    else:
        print("\n⚠️ Running in identity mode (no API keys)")
        print("Add GOOGLE_API_KEY or DEEPL_API_KEY to .env for real translation")

if __name__ == "__main__":
    asyncio.run(test_groq_translation())
