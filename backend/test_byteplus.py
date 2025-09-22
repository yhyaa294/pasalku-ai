#!/usr/bin/env python3
"""
Test script for BytePlus AI service integration
"""

import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_service import byteplus_service

async def test_byteplus_connection():
    """Test BytePlus AI service connection"""
    print("🔍 Testing BytePlus AI service connection...")

    try:
        # Test basic connection
        print("📡 Testing API connection...")
        result = byteplus_service.test_connection()

        if result:
            print("✅ Connection successful!")
            print(f"📊 API Key: {byteplus_service.api_key[:10]}...")
            print(f"🌐 Base URL: {byteplus_service.base_url}")
            print(f"🤖 Model: {byteplus_service.model}")
        else:
            print("❌ Connection failed!")
            return False

        # Test legal query
        print("\n🧪 Testing legal query...")
        test_query = "Apa saja hak-hak pekerja menurut Undang-Undang Ketenagakerjaan?"

        response = await byteplus_service.get_legal_response(test_query)

        if response and 'answer' in response:
            print("✅ Legal query successful!")
            print(f"📝 Response length: {len(response['answer'])} characters")
            print(f"📚 Citations found: {len(response.get('citations', []))}")

            # Show first 200 characters of response
            preview = response['answer'][:200] + "..." if len(response['answer']) > 200 else response['answer']
            print(f"📄 Response preview: {preview}")
        else:
            print("❌ Legal query failed!")
            return False

        return True

    except Exception as e:
        print(f"❌ Error during testing: {str(e)}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_byteplus_connection())

    if success:
        print("\n🎉 All tests passed! BytePlus AI service is ready.")
        sys.exit(0)
    else:
        print("\n💥 Tests failed! Please check your configuration.")
        sys.exit(1)
