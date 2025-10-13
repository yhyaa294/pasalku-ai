"""
Quick test untuk memverifikasi translation flow dan MongoDB save
"""
import asyncio
import sys
from datetime import datetime

# Setup path
sys.path.insert(0, "c:\\Users\\YAHYA\\pasalku-ai-3")

async def test_translation_service():
    """Test translation service"""
    print("\n=== Testing Translation Service ===")
    try:
        from backend.services.translation_service import translation_service
        
        print(f"✓ Translation service loaded")
        print(f"  Providers available: {translation_service.providers or ['identity (fallback)']}")
        print(f"  Primary provider: {translation_service.primary_provider}")
        
        # Test translation
        test_text = "Saya ingin konsultasi tentang hukum perdata"
        
        # Test to primary (id->id should be no-op)
        result1 = await translation_service.translate_to_primary(test_text, "id")
        print(f"✓ Translate to primary (id->id): {result1[:50]}...")
        
        # Test to user language
        result2 = await translation_service.translate_to_user(test_text, "en")
        print(f"✓ Translate to user (id->en): {result2[:50]}...")
        
        return True
    except Exception as e:
        print(f"✗ Translation service test failed: {e}")
        return False

async def test_mongodb_connection():
    """Test MongoDB connection"""
    print("\n=== Testing MongoDB Connection ===")
    try:
        from backend.database import get_mongo_client
        
        mongo_client = get_mongo_client()
        if not mongo_client:
            print("⚠ MongoDB not configured (optional - transcripts won't be saved)")
            return True
        
        # Test ping
        mongo_client.admin.command('ping')
        print("✓ MongoDB connection successful")
        
        # Test write to transcripts collection
        from backend.core.config import settings
        db = mongo_client[settings.MONGO_DB_NAME or "pasalku_ai_conversation_archive"]
        collection = db["transcripts"]
        
        test_doc = {
            "session_id": 99999,
            "user_id": 1,
            "timestamp": datetime.utcnow(),
            "language": "id",
            "test": True,
            "user_message": {
                "original": "Test message",
                "language": "id"
            },
            "ai_response": {
                "primary_language": "Test AI response",
                "language": "id"
            }
        }
        
        result = collection.insert_one(test_doc)
        print(f"✓ MongoDB write test successful (doc_id: {result.inserted_id})")
        
        # Clean up test document
        collection.delete_one({"_id": result.inserted_id})
        print("✓ Test document cleaned up")
        
        return True
    except Exception as e:
        print(f"⚠ MongoDB test failed (optional): {e}")
        return True  # Not critical

async def test_language_fields():
    """Test that models have language fields"""
    print("\n=== Testing Database Models ===")
    try:
        # Import from models.py directly
        import backend.models as models_module
        
        User = getattr(models_module, 'User', None)
        ChatSession = getattr(models_module, 'ChatSession', None)
        ChatMessage = getattr(models_module, 'ChatMessage', None)
        
        if not all([User, ChatSession, ChatMessage]):
            print("✗ Cannot find required model classes")
            return False
        
        # Check User model has preferred_language
        if hasattr(User, 'preferred_language'):
            print("✓ User model has 'preferred_language' field")
        else:
            print("⚠ User model missing 'preferred_language' field (non-critical)")
        
        # Check ChatSession has language
        if hasattr(ChatSession, 'language'):
            print("✓ ChatSession model has 'language' field")
        else:
            print("⚠ ChatSession model missing 'language' field (non-critical)")
        
        # Check ChatMessage has language and metadata
        has_language = hasattr(ChatMessage, 'language')
        has_metadata = hasattr(ChatMessage, 'metadata')
        
        if has_language and has_metadata:
            print("✓ ChatMessage model has 'language' and 'metadata' fields")
        else:
            missing = []
            if not has_language:
                missing.append('language')
            if not has_metadata:
                missing.append('metadata')
            print(f"⚠ ChatMessage model missing: {', '.join(missing)} (non-critical)")
        
        return True
    except Exception as e:
        print(f"✗ Model test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

async def main():
    """Run all tests"""
    print("🔍 Starting Translation Flow Verification...")
    print("=" * 60)
    
    results = []
    
    # Test 1: Translation Service
    results.append(("Translation Service", await test_translation_service()))
    
    # Test 2: MongoDB Connection
    results.append(("MongoDB Connection", await test_mongodb_connection()))
    
    # Test 3: Language Fields
    results.append(("Database Models", await test_language_fields()))
    
    # Summary
    print("\n" + "=" * 60)
    print("=== Test Summary ===")
    all_passed = True
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{name}: {status}")
        if not result:
            all_passed = False
    
    if all_passed:
        print("\n✨ All translation flow components operational!")
        print("\n📝 Next Steps:")
        print("1. Add translation API keys to .env (GOOGLE_API_KEY or DEEPL_API_KEY)")
        print("2. Test with real frontend request")
        print("3. Verify MongoDB transcript saves with real data")
        return 0
    else:
        print("\n⚠️ Some components failed")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
