"""
Test Dual AI Consensus Engine

Run this script to test the consensus algorithm between BytePlus Ark and Groq.
"""

import asyncio
import sys
from pathlib import Path

# Add parent directories to path
sys.path.append(str(Path(__file__).parent.parent.parent))

from services.ai.consensus_engine import (
    DualAIConsensusEngine,
    get_consensus_engine
)
from services.ai.groq_service import get_groq_service
from services.ai.byteplus_service import get_byteplus_service


async def test_basic_consensus():
    """Test basic consensus functionality"""
    print("\n" + "="*60)
    print("TEST 1: Basic Consensus")
    print("="*60)
    
    try:
        # Initialize services
        byteplus_service = ArkAIService()
        groq_service = get_groq_service()
        
        # Create consensus engine
        engine = DualAIConsensusEngine(
            byteplus_service=byteplus_service,
            groq_service=groq_service,
            enable_parallel=True
        )
        
        # Test prompt
        prompt = "Jelaskan apa itu hukum perdata dalam konteks Indonesia."
        system_prompt = "Anda adalah asisten hukum AI yang ahli dalam hukum Indonesia."
        
        print(f"\n📝 Prompt: {prompt}")
        print("⏳ Processing with both AI models...")
        
        # Get consensus
        result = await engine.get_consensus_response(
            prompt=prompt,
            system_prompt=system_prompt,
            temperature=0.7,
            max_tokens=500
        )
        
        # Display results
        print("\n" + "-"*60)
        print("📊 RESULTS")
        print("-"*60)
        
        print(f"\n🎯 Consensus Method: {result.consensus_method}")
        print(f"📈 Consensus Confidence: {result.consensus_confidence:.2%}")
        print(f"🔗 Similarity Score: {result.similarity_score:.2%}")
        print(f"⏱️ Total Time: {result.total_time:.2f}s")
        
        print(f"\n🤖 BytePlus Ark:")
        print(f"  - Confidence: {result.byteplus_response.confidence:.2%}")
        print(f"  - Response Time: {result.byteplus_response.response_time:.2f}s")
        print(f"  - Tokens: {result.byteplus_response.tokens_used}")
        
        print(f"\n⚡ Groq:")
        print(f"  - Confidence: {result.groq_response.confidence:.2%}")
        print(f"  - Response Time: {result.groq_response.response_time:.2f}s")
        print(f"  - Tokens: {result.groq_response.tokens_used}")
        
        print(f"\n💬 Final Response:")
        print("-"*60)
        print(result.final_content[:500] + "..." if len(result.final_content) > 500 else result.final_content)
        
        print("\n✅ Basic consensus test PASSED")
        return True
        
    except Exception as e:
        print(f"\n❌ Basic consensus test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False


async def test_similarity_calculation():
    """Test similarity calculation algorithm"""
    print("\n" + "="*60)
    print("TEST 2: Similarity Calculation")
    print("="*60)
    
    try:
        byteplus_service = ArkAIService()
        groq_service = get_groq_service()
        
        engine = DualAIConsensusEngine(
            byteplus_service=byteplus_service,
            groq_service=groq_service
        )
        
        # Test cases
        test_cases = [
            {
                "text1": "Hukum perdata mengatur hubungan antar individu.",
                "text2": "Hukum perdata mengatur hubungan antar individu.",
                "expected": "high"
            },
            {
                "text1": "Hukum perdata mengatur hubungan antar individu dan badan hukum.",
                "text2": "Hukum perdata adalah hukum yang mengatur hubungan pribadi.",
                "expected": "moderate"
            },
            {
                "text1": "Hukum perdata mengatur hubungan antar individu.",
                "text2": "Hukum pidana mengatur tindak kejahatan.",
                "expected": "low"
            }
        ]
        
        print("\n🧪 Testing similarity with different text pairs:\n")
        
        all_passed = True
        for i, case in enumerate(test_cases, 1):
            similarity = engine._calculate_semantic_similarity(
                case["text1"],
                case["text2"]
            )
            
            print(f"Test Case {i}:")
            print(f"  Text 1: {case['text1'][:50]}...")
            print(f"  Text 2: {case['text2'][:50]}...")
            print(f"  Similarity: {similarity:.2%}")
            print(f"  Expected: {case['expected']}")
            
            # Validate
            if case["expected"] == "high" and similarity >= 0.85:
                print(f"  ✅ PASS\n")
            elif case["expected"] == "moderate" and 0.60 <= similarity < 0.85:
                print(f"  ✅ PASS\n")
            elif case["expected"] == "low" and similarity < 0.60:
                print(f"  ✅ PASS\n")
            else:
                print(f"  ❌ FAIL\n")
                all_passed = False
        
        if all_passed:
            print("✅ Similarity calculation test PASSED")
            return True
        else:
            print("❌ Some similarity tests FAILED")
            return False
            
    except Exception as e:
        print(f"\n❌ Similarity calculation test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False


async def test_legal_query_consensus():
    """Test consensus on actual legal query"""
    print("\n" + "="*60)
    print("TEST 3: Legal Query Consensus")
    print("="*60)
    
    try:
        byteplus_service = ArkAIService()
        groq_service = get_groq_service()
        
        engine = get_consensus_engine(
            byteplus_service=byteplus_service,
            groq_service=groq_service
        )
        
        # Legal query
        prompt = """
        Saya memiliki tetangga yang membangun tembok di atas tanah saya.
        Ketika saya tegur, dia mengatakan tanah itu miliknya. 
        Apa yang harus saya lakukan secara hukum?
        """
        
        system_prompt = """
        Anda adalah AI asisten hukum Pasalku.ai yang ahli dalam hukum Indonesia.
        Berikan jawaban yang akurat dengan menyebutkan dasar hukum yang relevan.
        Gunakan bahasa yang mudah dipahami.
        """
        
        print(f"\n📝 Legal Query: {prompt.strip()}")
        print("\n⏳ Getting consensus response...")
        
        result = await engine.get_consensus_response(
            prompt=prompt,
            system_prompt=system_prompt,
            temperature=0.6,  # Lower for legal accuracy
            max_tokens=1000
        )
        
        print("\n" + "-"*60)
        print("📊 CONSENSUS RESULT")
        print("-"*60)
        
        print(f"\n🎯 Method: {result.consensus_method}")
        print(f"📈 Confidence: {result.consensus_confidence:.2%}")
        print(f"🔗 Similarity: {result.similarity_score:.2%}")
        
        print(f"\n💬 Legal Advice:")
        print("-"*60)
        print(result.final_content)
        
        # Save to file for review
        output_file = Path(__file__).parent / "test_consensus_output.txt"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write("="*60 + "\n")
            f.write("DUAL AI CONSENSUS TEST OUTPUT\n")
            f.write("="*60 + "\n\n")
            f.write(f"Query: {prompt.strip()}\n\n")
            f.write(f"Consensus Method: {result.consensus_method}\n")
            f.write(f"Confidence: {result.consensus_confidence:.2%}\n")
            f.write(f"Similarity: {result.similarity_score:.2%}\n\n")
            f.write("-"*60 + "\n")
            f.write("FINAL RESPONSE:\n")
            f.write("-"*60 + "\n")
            f.write(result.final_content)
            f.write("\n\n" + "-"*60 + "\n")
            f.write("BYTEPLUS ARK RESPONSE:\n")
            f.write("-"*60 + "\n")
            f.write(result.byteplus_response.content)
            f.write("\n\n" + "-"*60 + "\n")
            f.write("GROQ RESPONSE:\n")
            f.write("-"*60 + "\n")
            f.write(result.groq_response.content)
        
        print(f"\n💾 Full output saved to: {output_file}")
        print("\n✅ Legal query consensus test PASSED")
        return True
        
    except Exception as e:
        print(f"\n❌ Legal query consensus test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False


async def run_all_tests():
    """Run all consensus tests"""
    print("\n" + "="*60)
    print("🧪 DUAL AI CONSENSUS ENGINE TEST SUITE")
    print("="*60)
    
    tests = [
        ("Basic Consensus", test_basic_consensus),
        ("Similarity Calculation", test_similarity_calculation),
        ("Legal Query Consensus", test_legal_query_consensus)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = await test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"\n❌ Test '{test_name}' crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"  {test_name:.<40} {status}")
    
    print(f"\n  Total: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests PASSED! Consensus engine is ready.")
    else:
        print(f"\n⚠️ {total - passed} test(s) failed. Please check the errors.")
    
    return passed == total


if __name__ == "__main__":
    print("\n🚀 Starting Dual AI Consensus Engine Tests...")
    
    try:
        success = asyncio.run(run_all_tests())
        
        if success:
            print("\n✅ Consensus engine is fully functional!")
            sys.exit(0)
        else:
            print("\n❌ Some tests failed. Please fix the issues.")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n\n⚠️ Tests interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Test suite crashed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
