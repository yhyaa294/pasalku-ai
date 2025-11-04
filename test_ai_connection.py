"""
Test script untuk koneksi BytePlus Ark AI Engine
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_byteplus_ark():
    """Test koneksi ke BytePlus Ark"""
    try:
        from openai import OpenAI
        
        print("🔍 Testing BytePlus Ark connection...")
        print(f"   API Key: {os.getenv('ARK_API_KEY')[:20]}...")
        print(f"   Base URL: {os.getenv('ARK_BASE_URL')}")
        print(f"   Model ID: {os.getenv('ARK_MODEL_ID')}")
        
        client = OpenAI(
            api_key=os.getenv("ARK_API_KEY"),
            base_url=os.getenv("ARK_BASE_URL")
        )
        
        response = client.chat.completions.create(
            model=os.getenv("ARK_MODEL_ID"),
            messages=[
                {"role": "system", "content": "Kamu adalah asisten hukum AI bernama Pasalku AI."},
                {"role": "user", "content": "Halo, test koneksi"}
            ],
            max_tokens=100
        )
        
        print("✅ BytePlus Ark connection successful!")
        print(f"📝 Response: {response.choices[0].message.content}")
        return True
        
    except Exception as e:
        print(f"❌ BytePlus Ark connection failed: {str(e)}")
        return False

def test_groq_fallback():
    """Test koneksi ke Groq sebagai fallback"""
    try:
        from groq import Groq
        
        print("\n🔍 Testing Groq fallback connection...")
        print(f"   API Key: {os.getenv('GROQ_API_KEY')[:20]}...")
        
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
        response = client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[
                {"role": "system", "content": "Kamu adalah asisten hukum AI bernama Pasalku AI."},
                {"role": "user", "content": "Halo, test koneksi"}
            ],
            max_tokens=100
        )
        
        print("✅ Groq connection successful!")
        print(f"📝 Response: {response.choices[0].message.content}")
        return True
        
    except Exception as e:
        print(f"❌ Groq connection failed: {str(e)}")
        return False

def test_gemini():
    """Test koneksi ke Google Gemini"""
    try:
        import google.generativeai as genai
        
        print("\n🔍 Testing Google Gemini connection...")
        print(f"   API Key: {os.getenv('GEMINI_API_KEY')[:20]}...")
        
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel('gemini-pro')
        
        response = model.generate_content("Halo, test koneksi")
        
        print("✅ Gemini connection successful!")
        print(f"📝 Response: {response.text[:100]}")
        return True
        
    except Exception as e:
        print(f"❌ Gemini connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("🤖 Pasalku AI - AI Engine Connection Test")
    print("=" * 60)
    
    results = {
        "BytePlus Ark": test_byteplus_ark(),
        "Groq": test_groq_fallback(),
        "Gemini": test_gemini()
    }
    
    print("\n" + "=" * 60)
    print("📊 Test Results Summary:")
    print("=" * 60)
    for service, success in results.items():
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{service}: {status}")
    
    # Overall result
    if any(results.values()):
        print("\n✅ At least one AI service is working!")
    else:
        print("\n❌ All AI services failed. Please check your API keys.")
