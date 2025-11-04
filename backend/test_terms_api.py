"""
Test script for Legal Terms Detection API
Tests the Live Contextual Tutor system end-to-end
"""

import requests
import json

BASE_URL = "http://localhost:8001/api/terms"

def test_detect_terms():
    """Test term detection endpoint"""
    print("\n=== TEST 1: Term Detection ===")
    
    test_text = """
    Dalam kasus ini, pihak perusahaan melakukan wanprestasi karena tidak 
    memberikan pesangon yang seharusnya. Anda bisa mengirim somasi terlebih 
    dahulu sebelum mengajukan gugatan perbuatan melawan hukum ke pengadilan.
    """
    
    payload = {"text": test_text}
    
    try:
        response = requests.post(f"{BASE_URL}/detect", json=payload)
        response.raise_for_status()
        result = response.json()
        
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Terms detected: {len(result['detected_terms'])}")
        
        for term in result['detected_terms']:
            print(f"\n📌 Term: {term['term']}")
            print(f"   Position: {term['start_pos']} - {term['end_pos']}")
            print(f"   Category: {term['category']}")
            print(f"   Definition: {term['definition_simple'][:60]}...")
            
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_get_term_details():
    """Test get term details endpoint"""
    print("\n=== TEST 2: Get Term Details ===")
    
    term_name = "wanprestasi"
    
    try:
        response = requests.get(f"{BASE_URL}/term/{term_name}")
        response.raise_for_status()
        result = response.json()
        
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Term: {result['term']}")
        print(f"   Formal: {result['definition_formal'][:80]}...")
        print(f"   Simple: {result['definition_simple']}")
        print(f"   Analogy: {result['analogy']}")
        print(f"   Articles: {', '.join(result['related_articles'])}")
        
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_search_terms():
    """Test search terms endpoint"""
    print("\n=== TEST 3: Search Terms ===")
    
    query = "kontrak"
    
    try:
        response = requests.get(f"{BASE_URL}/search", params={"q": query})
        response.raise_for_status()
        result = response.json()
        
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Results: {result['total_results']}")
        
        for term in result['terms']:
            print(f"\n📌 {term['term']} ({term['category']})")
            print(f"   {term['definition_simple'][:60]}...")
            
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_get_categories():
    """Test get categories endpoint"""
    print("\n=== TEST 4: Get Categories ===")
    
    try:
        response = requests.get(f"{BASE_URL}/categories")
        response.raise_for_status()
        result = response.json()
        
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Total categories: {result['total']}")
        
        for cat in result['categories']:
            print(f"\n📂 {cat['name']} - {cat['count']} terms")
            print(f"   Example: {cat['example_term']}")
            
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def run_all_tests():
    """Run all tests"""
    print("\n" + "="*60)
    print("🚀 TESTING LIVE CONTEXTUAL TUTOR API")
    print("="*60)
    
    results = []
    
    results.append(("Detect Terms", test_detect_terms()))
    results.append(("Get Term Details", test_get_term_details()))
    results.append(("Search Terms", test_search_terms()))
    results.append(("Get Categories", test_get_categories()))
    
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    total_passed = sum(1 for _, passed in results if passed)
    total_tests = len(results)
    
    print(f"\n📈 Total: {total_passed}/{total_tests} tests passed")
    
    if total_passed == total_tests:
        print("🎉 ALL TESTS PASSED!")
    else:
        print("⚠️  Some tests failed. Check logs above.")


if __name__ == "__main__":
    print("ℹ️  Make sure backend server is running on http://localhost:8001")
    print("ℹ️  Start it with: python backend/test_server.py")
    
    input("\nPress Enter to start tests...")
    
    run_all_tests()
