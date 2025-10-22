"""
Smoke Test for Stateful Consultation Flow
Tests the complete 4-step consultation process end-to-end
"""
import asyncio
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

from services.consultation_flow import (
    advance_flow,
    generate_clarification_questions,
    generate_conversation_summary,
    generate_final_analysis,
    state_store,
    ConversationState
)


async def test_full_consultation_flow():
    """Test the complete consultation flow from start to finish"""
    
    print("🧪 Starting Stateful Consultation Flow Smoke Test\n")
    print("=" * 70)
    
    session_id = 999  # Test session ID
    
    # Clean slate
    if session_id in state_store._store:
        del state_store._store[session_id]
    
    # Step 1: Initial problem submission
    print("\n📝 STEP 1: User submits initial problem")
    print("-" * 70)
    
    initial_problem = "Saya di-PHK dari perusahaan tanpa alasan yang jelas setelah 5 tahun bekerja"
    print(f"User: {initial_problem}")
    
    result1 = await advance_flow(session_id, initial_problem)
    
    print(f"\nState: {result1['state']}")
    print(f"Message: {result1['message']}")
    print(f"\nClarification Questions ({len(result1['questions'])}):")
    for i, q in enumerate(result1['questions'], 1):
        print(f"  {i}. {q}")
    
    assert result1['state'] == ConversationState.AWAITING_CLARIFICATION_ANSWERS
    assert len(result1['questions']) >= 3, "Should generate at least 3 questions"
    
    print("\n✅ Step 1 PASSED: Questions generated successfully")
    
    # Step 2: Answer clarification questions one by one
    print("\n📝 STEP 2: User answers clarification questions")
    print("-" * 70)
    
    answers = [
        "2 minggu yang lalu",
        "Perusahaan bilang karena efisiensi tapi tidak jelas",
        "Ada kontrak kerja PKWTT",
        "5 tahun saya bekerja di sana",
        "Ada surat PHK dari HRD"
    ]
    
    for i, answer in enumerate(answers):
        print(f"\nAnswer {i+1}: {answer}")
        result = await advance_flow(session_id, answer)
        print(f"State: {result['state']}")
        
        if 'next_question' in result:
            print(f"Progress: {result['answered']}/{result['total']}")
            print(f"Next: {result['next_question']}")
        elif 'summary' in result:
            print(f"Summary generated!")
            result2 = result
            break
    
    assert result2['state'] == ConversationState.AWAITING_SUMMARY_CONFIRMATION
    assert 'summary' in result2
    
    print("\n✅ Step 2 PASSED: All questions answered, summary generated")
    
    # Step 3: Confirm summary
    print("\n📝 STEP 3: User confirms summary")
    print("-" * 70)
    print(f"Summary:\n{result2['summary']}\n")
    print("User: ya")
    
    result3 = await advance_flow(session_id, "ya")
    
    print(f"\nState: {result3['state']}")
    print(f"Message: {result3['message']}")
    
    assert result3['state'] == ConversationState.AWAITING_EVIDENCE_CONFIRMATION
    
    print("\n✅ Step 3 PASSED: Summary confirmed, asking for evidence")
    
    # Step 4: Confirm evidence and get final analysis
    print("\n📝 STEP 4: User confirms evidence availability")
    print("-" * 70)
    print("User: ada")
    
    result4 = await advance_flow(session_id, "ada")
    
    print(f"\nState: {result4['state']}")
    
    assert result4['state'] == ConversationState.ANALYSIS_COMPLETE
    assert 'final_analysis' in result4
    
    analysis = result4['final_analysis']
    print("\n📊 FINAL ANALYSIS:")
    print("-" * 70)
    print(f"\n🔍 Ringkasan: {analysis['analisis']['ringkasan_masalah']}")
    print(f"\n📌 Poin Kunci ({len(analysis['analisis']['poin_kunci'])}):")
    for poin in analysis['analisis']['poin_kunci']:
        print(f"  • {poin}")
    
    print(f"\n⚖️  Dasar Hukum ({len(analysis['analisis']['dasar_hukum'])}):")
    for dasar in analysis['analisis']['dasar_hukum']:
        print(f"  • {dasar}")
    
    print(f"\n💡 Opsi Solusi ({len(analysis['opsi_solusi'])}):")
    for i, solusi in enumerate(analysis['opsi_solusi'], 1):
        print(f"\n  {i}. {solusi['judul']}")
        print(f"     {solusi['deskripsi']}")
        print(f"     Durasi: {solusi['estimasi_durasi']}")
        print(f"     Biaya: {solusi['estimasi_biaya']}")
        print(f"     Tingkat Keberhasilan: {solusi['tingkat_keberhasilan']}")
    
    print(f"\n⚠️  {analysis['disclaimer']}")
    
    print("\n✅ Step 4 PASSED: Final analysis generated successfully")
    
    # Test state persistence (serialization)
    print("\n📝 TESTING STATE PERSISTENCE")
    print("-" * 70)
    
    ctx = state_store.get(session_id)
    serialized = ctx.to_dict()
    
    print(f"Serialized keys: {list(serialized.keys())}")
    print(f"State in dict: {serialized['state']}")
    
    from services.consultation_flow import ConsultationContext
    deserialized = ConsultationContext.from_dict(serialized)
    
    assert deserialized.problem_description == initial_problem
    assert deserialized.state == ConversationState.ANALYSIS_COMPLETE
    assert len(deserialized.clarification_answers) > 0
    
    print("✅ Serialization/deserialization working correctly")
    
    print("\n" + "=" * 70)
    print("🎉 ALL TESTS PASSED!")
    print("=" * 70)
    print("\nThe stateful consultation flow is working correctly:")
    print("  ✅ Initial problem triggers clarification questions")
    print("  ✅ Questions are answered incrementally")
    print("  ✅ Summary generated and can be confirmed")
    print("  ✅ Evidence confirmation collected")
    print("  ✅ Final structured analysis generated")
    print("  ✅ State serialization/deserialization works")
    print("\n💡 Next step: Run database migration and test with real API")


async def test_ai_functions():
    """Test individual AI specialist functions"""
    
    print("\n\n🔬 Testing Individual AI Specialist Functions")
    print("=" * 70)
    
    # Test 1: Clarification questions
    print("\n1️⃣  Testing generate_clarification_questions()")
    print("-" * 70)
    
    problem = "Saya mengalami pelecehan seksual di tempat kerja"
    questions = await generate_clarification_questions(problem)
    
    print(f"Input: {problem}")
    print(f"Generated {len(questions)} questions:")
    for i, q in enumerate(questions, 1):
        print(f"  {i}. {q}")
    
    assert len(questions) >= 3
    print("✅ PASSED")
    
    # Test 2: Conversation summary
    print("\n2️⃣  Testing generate_conversation_summary()")
    print("-" * 70)
    
    answers = {
        "Kapan kejadian terjadi?": "3 bulan yang lalu",
        "Siapa pelakunya?": "Atasan langsung saya",
        "Apakah ada saksi?": "Tidak ada, terjadi di ruang tertutup",
        "Sudah lapor ke HRD?": "Belum, takut kehilangan pekerjaan"
    }
    
    summary = await generate_conversation_summary(answers)
    
    print(f"Input answers: {len(answers)} items")
    print(f"\nGenerated summary:\n{summary}")
    
    assert "konfirmasi" in summary.lower() or "benar" in summary.lower()
    print("✅ PASSED")
    
    # Test 3: Final analysis
    print("\n3️⃣  Testing generate_final_analysis()")
    print("-" * 70)
    
    context = {
        "problem_description": problem,
        "clarification_answers": answers,
        "evidence_confirmed": True
    }
    
    analysis = await generate_final_analysis(context)
    
    print(f"Analysis keys: {list(analysis.keys())}")
    assert "analisis" in analysis
    assert "opsi_solusi" in analysis
    assert "disclaimer" in analysis
    
    print(f"  ✓ analisis.poin_kunci: {len(analysis['analisis']['poin_kunci'])} items")
    print(f"  ✓ analisis.dasar_hukum: {len(analysis['analisis']['dasar_hukum'])} items")
    print(f"  ✓ opsi_solusi: {len(analysis['opsi_solusi'])} options")
    print(f"  ✓ disclaimer: present")
    
    print("✅ PASSED")
    
    print("\n" + "=" * 70)
    print("🎉 ALL AI FUNCTION TESTS PASSED!")
    print("=" * 70)


async def main():
    """Run all tests"""
    try:
        await test_full_consultation_flow()
        await test_ai_functions()
        
        print("\n\n🏁 SMOKE TEST SUITE COMPLETE")
        print("=" * 70)
        print("All systems operational! ✨")
        print("\nReady for production deployment after:")
        print("  1. Database migration")
        print("  2. BytePlus Ark API key configuration")
        print("  3. Frontend integration")
        
        return 0
        
    except Exception as e:
        print(f"\n\n❌ TEST FAILED: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
