#!/usr/bin/env python3
"""
Simple AI integration test script
"""
import os
import sys

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from core.config import get_settings
    print("✅ Config import successful")
except ImportError as e:
    print(f"❌ Config import failed: {e}")
    sys.exit(1)

try:
    settings = get_settings()
    print("✅ Settings loaded successfully")
except Exception as e:
    print(f"❌ Settings loading failed: {e}")
    sys.exit(1)

# Test AI Services Configuration
print("\n🤖 Testing AI Services Configuration:")
print("=" * 50)

# Test BytePlus Ark Configuration
if hasattr(settings, 'ARK_API_KEY') and settings.ARK_API_KEY:
    if settings.ARK_API_KEY != 'your_ark_api_key_here':
        print("✅ BytePlus Ark: API Key configured")
        if hasattr(settings, 'ARK_MODEL_ID') and settings.ARK_MODEL_ID:
            print(f"✅ BytePlus Ark: Model ID set to {settings.ARK_MODEL_ID}")
        else:
            print("⚠️ BytePlus Ark: Model ID not configured")
    else:
        print("⚠️ BytePlus Ark: Using placeholder API key")
else:
    print("❌ BytePlus Ark: API Key not configured")

# Test Groq Configuration
if hasattr(settings, 'GROQ_API_KEY') and settings.GROQ_API_KEY:
    if settings.GROQ_API_KEY != 'your_groq_api_key_here':
        print("✅ Groq AI: API Key configured")
    else:
        print("⚠️ Groq AI: Using placeholder API key")
else:
    print("❌ Groq AI: API Key not configured")

# Test OpenAI Configuration (if available)
if hasattr(settings, 'OPENAI_API_KEY') and settings.OPENAI_API_KEY:
    if settings.OPENAI_API_KEY != 'your_openai_api_key_here':
        print("✅ OpenAI: API Key configured")
    else:
        print("⚠️ OpenAI: Using placeholder API key")
else:
    print("⚠️ OpenAI: API Key not configured")

# Test actual AI service connections
print("\n🔗 Testing AI Service Connections:")
print("=" * 50)

# Test Groq Connection
if hasattr(settings, 'GROQ_API_KEY') and settings.GROQ_API_KEY and settings.GROQ_API_KEY != 'your_groq_api_key_here':
    try:
        from groq import Groq
        client = Groq(api_key=settings.GROQ_API_KEY)
        # Test with a simple completion
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": "Hello"}],
            max_tokens=10
        )
        print("✅ Groq AI: Connection successful")
    except Exception as e:
        print(f"❌ Groq AI: Connection failed - {e}")
else:
    print("⚠️ Groq AI: Skipping test (API key not configured)")

# Test BytePlus Ark Connection (if available)
if hasattr(settings, 'ARK_API_KEY') and settings.ARK_API_KEY and settings.ARK_API_KEY != 'your_ark_api_key_here':
    try:
        import requests
        headers = {
            "Authorization": f"Bearer {settings.ARK_API_KEY}",
            "Content-Type": "application/json"
        }
        # Simple health check or model list request
        response = requests.get(
            f"{settings.ARK_BASE_URL}/models",
            headers=headers,
            timeout=10
        )
        if response.status_code == 200:
            print("✅ BytePlus Ark: Connection successful")
        else:
            print(f"⚠️ BytePlus Ark: API returned status {response.status_code}")
    except Exception as e:
        print(f"❌ BytePlus Ark: Connection failed - {e}")
else:
    print("⚠️ BytePlus Ark: Skipping test (API key not configured)")

print("\n🎯 AI Services Test Complete!")
print("\n📝 Summary:")
print("- Configure actual API keys in .env file to enable AI services")
print("- BytePlus Ark is the primary AI service")
print("- Groq AI serves as fallback/secondary service")
print("- Both services support Indonesian legal consultation")
