"""
Test runner for Knowledge Graph Service
Fixes import conflicts by ensuring edgedb package is imported correctly.
"""

import sys
import os
from pathlib import Path

# Ensure backend is in path
backend_dir = Path(__file__).parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# Import edgedb package BEFORE local modules
import edgedb

# Now we can safely import our modules
import asyncio
from services.knowledge_graph.search_engine import get_search_engine, SearchResult
from services.knowledge_graph.citation_extractor import get_citation_extractor
from services.knowledge_graph.relevance_ranker import get_relevance_ranker


async def test_citation_extraction():
    """Test citation extraction from text"""
    print("\n" + "="*60)
    print("TEST 1: Citation Extraction")
    print("="*60)
    
    try:
        extractor = get_citation_extractor()
        
        # Test text with various citations
        test_text = """
        Berdasarkan Pasal 39 UU No. 1 Tahun 1974 tentang Perkawinan, 
        perceraian dapat dilakukan dengan alasan tertentu.
        
        Sesuai dengan PP No. 9 Tahun 1975 dan Putusan MA No. 123/Pid.B/2020/PN JKT,
        maka prosedur yang harus diikuti adalah sebagai berikut.
        
        Mengacu pada Pasal 362 KUHP tentang pencurian...
        """
        
        # Extract citations
        citations = extractor.extract(test_text)
        
        print(f"\n✅ Found {len(citations)} citations:")
        for i, citation in enumerate(citations, 1):
            print(f"\n{i}. {citation.raw_text}")
            print(f"   Type: {citation.citation_type}")
            print(f"   Formatted: {extractor.format_citation(citation)}")
        
        # Test reference list generation
        ref_list = extractor.generate_reference_list(citations)
        print(f"\n📚 Reference List:\n{ref_list}")
        
        print("\n✅ Citation extraction test PASSED")
        return True
        
    except Exception as e:
        print(f"\n❌ Citation extraction test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False


async def test_relevance_ranking():
    """Test relevance ranking algorithm"""
    print("\n" + "="*60)
    print("TEST 2: Relevance Ranking")
    print("="*60)
    
    try:
        from services.knowledge_graph.search_engine import CitationInfo
        ranker = get_relevance_ranker()
        
        # Create mock search results as CitationInfo objects
        from datetime import datetime
        mock_results = [
            CitationInfo(
                document_id='1',
                document_type='law',
                title='Undang-Undang Perkawinan',
                citation_text='UU No. 1 Tahun 1974',
                excerpt='Mengatur tentang perkawinan dan perceraian di Indonesia',
                url='',
                relevance_score=0.0
            ),
            CitationInfo(
                document_id='2',
                document_type='court_case',
                title='Putusan Pengadilan tentang Perceraian',
                citation_text='Putusan MA No. 123/Pid',
                excerpt='Kasus perceraian dengan alasan perselingkuhan',
                url='',
                relevance_score=0.0
            ),
            CitationInfo(
                document_id='3',
                document_type='article',
                title='Artikel tentang Hukum Perkawinan',
                citation_text='Artikel',
                excerpt='Analisis mendalam tentang UU Perkawinan',
                url='',
                relevance_score=0.0
            )
        ]
        
        query = "perceraian karena perselingkuhan"
        
        # Rank results
        ranked = await ranker.rank(query, mock_results, enable_semantic=False)
        
        print(f"\n✅ Ranked {len(ranked)} results:")
        for i, result in enumerate(ranked, 1):
            print(f"\n{i}. {result.citation.title} (Score: {result.total_score:.3f})")
            print(f"   Type: {result.citation.document_type}")
            explanation = ranker.get_ranking_explanation(result)
            print(f"   Breakdown: {explanation}")
        
        print("\n✅ Relevance ranking test PASSED")
        return True
        
    except Exception as e:
        print(f"\n❌ Relevance ranking test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False


async def test_semantic_search():
    """Test semantic search (without database connection)"""
    print("\n" + "="*60)
    print("TEST 3: Semantic Search Engine")
    print("="*60)
    
    try:
        # Note: This will test the search engine initialization
        # Full tests require EdgeDB connection
        search_engine = get_search_engine(enable_ai_enhancement=False)
        
        print("✅ Search engine initialized successfully")
        print(f"   AI Enhancement: {search_engine.enable_ai_enhancement}")
        print(f"   EdgeDB Client: {'Connected' if search_engine.edgedb_client else 'Not connected (expected for unit test)'}")
        
        print("\n⚠️  Note: Full semantic search tests require EdgeDB connection")
        print("   Run this test after EdgeDB is populated with legal data (Todo #17)")
        
        print("\n✅ Semantic search test PASSED (initialization only)")
        return True
        
    except Exception as e:
        print(f"\n❌ Semantic search test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False


async def run_all_tests():
    """Run all Knowledge Graph tests"""
    print("\n" + "="*80)
    print("🧪 KNOWLEDGE GRAPH SERVICE TEST SUITE")
    print("="*80)
    
    results = []
    tests = [
        ("Citation Extraction", test_citation_extraction),
        ("Relevance Ranking", test_relevance_ranking),
        ("Semantic Search Engine", test_semantic_search),
    ]
    
    for test_name, test_func in tests:
        result = await test_func()
        results.append((test_name, result))
    
    # Summary
    print("\n" + "="*80)
    print("📊 TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! 🎉")
        print("\n✨ Knowledge Graph Service is ready!")
        print("\nNext Steps:")
        print("1. Populate EdgeDB with legal data (Todo #17)")
        print("2. Test with real database queries")
        print("3. Integrate with frontend chat interface")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
    
    return passed == total


if __name__ == "__main__":
    success = asyncio.run(run_all_tests())
    sys.exit(0 if success else 1)
