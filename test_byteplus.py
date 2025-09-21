#!/usr/bin/env python3
"""
Test script untuk BytePlus API connection
"""
import os
import sys
import requests

def test_byteplus_direct():
    """Test BytePlus API langsung dengan curl-style request"""
    print("🧪 Testing BytePlus API connection...")

    api_key = "863f6a1b-e0ed-4cff-a198-26b92dec48c2"
    url = "https://ark.ap-southeast.bytepluses.com/api/v3/chat/completions"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    data = {
        "model": "ep-20250830093230-swczp",
        "messages": [
            {"role": "system", "content": "You are an artificial intelligence assistant."},
            {"role": "user", "content": "Hello, can you respond in Indonesian?"}
        ]
    }

    try:
        print("📡 Sending request to BytePlus API...")
        response = requests.post(url, headers=headers, json=data, timeout=10)

        print(f"📊 Status Code: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            answer = result["choices"][0]["message"]["content"]
            print("✅ BytePlus API Working!")
            print(f"🤖 Response: {answer[:100]}...")
            return True
        else:
            print(f"❌ API Error: {response.status_code}")
            print(f"Response: {response.text}")
            return False

    except requests.exceptions.Timeout:
        print("❌ Request timeout - check internet connection")
        return False
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - check internet connection")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_with_sdk():
    """Test dengan BytePlus SDK"""
    print("\n🔧 Testing with BytePlus SDK...")

    try:
        # Set environment variable
        os.environ['ARK_API_KEY'] = '863f6a1b-e0ed-4cff-a198-26b92dec48c2'

        # Import SDK components
        import byteplussdkcore
        from byteplussdkarkruntime import Ark

        print("✅ SDK imports successful")

        # Configure SDK
        configuration = byteplussdkcore.Configuration()
        configuration.client_side_validation = True
        configuration.schema = "http"
        configuration.debug = False
        configuration.logger_file = "sdk.log"
        byteplussdkcore.Configuration.set_default(configuration)

        print("✅ SDK configuration successful")

        # Initialize client
        client = Ark(
            api_key=os.environ.get("ARK_API_KEY"),
            base_url="https://ark.ap-southeast.bytepluses.com/api/v3",
            region="ap-southeast"
        )

        print("✅ Client initialization successful")

        # Test API call
        completion = client.chat.completions.create(
            model="ep-20250830093230-swczp",
            messages=[
                {"role": "system", "content": "You are an AI assistant."},
                {"role": "user", "content": "Hello"},
            ],
            extra_headers={'x-is-encrypted': 'true'},
            max_tokens=50
        )

        answer = completion.choices[0].message.content
        print("✅ BytePlus SDK Working!")
        print(f"🤖 SDK Response: {answer}")
        return True

    except ImportError as e:
        print(f"❌ Import Error: {e}")
        print("💡 Solution: pip install byteplus-python-sdk-v2")
        return False
    except Exception as e:
        print(f"❌ SDK Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 BytePlus API Test Script")
    print("=" * 40)

    # Test 1: Direct API call
    direct_success = test_byteplus_direct()

    # Test 2: SDK approach
    sdk_success = test_with_sdk()

    print("\n" + "=" * 40)
    if direct_success and sdk_success:
        print("🎉 ALL TESTS PASSED! BytePlus API is working!")
        sys.exit(0)
    else:
        print("⚠️  Some tests failed. Check the errors above.")
        sys.exit(1)
