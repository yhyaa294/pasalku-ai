"""
Test EdgeDB Setup and Operations

Run this script to verify EdgeDB installation and test basic operations.
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from edgedb.connection import (
    test_connection,
    get_database_info,
    init_edgedb,
    close_edgedb
)
from edgedb.repository import (
    LegalDocumentRepository,
    ArticleRepository,
    CourtCaseRepository,
    LegalTopicRepository
)


async def test_basic_connection():
    """Test basic EdgeDB connection."""
    print("\n" + "="*60)
    print("TEST 1: Basic Connection")
    print("="*60)
    
    success = await test_connection()
    
    if success:
        print("✅ Connection test PASSED")
        return True
    else:
        print("❌ Connection test FAILED")
        return False


async def test_database_info():
    """Test getting database information."""
    print("\n" + "="*60)
    print("TEST 2: Database Information")
    print("="*60)
    
    info = await get_database_info()
    
    print("\n📊 Database Statistics:")
    for key, value in info.items():
        print(f"  {key:.<30} {value}")
    
    if info.get("status") == "connected":
        print("\n✅ Database info test PASSED")
        return True
    else:
        print("\n❌ Database info test FAILED")
        return False


async def test_create_sample_data():
    """Test creating sample legal data."""
    print("\n" + "="*60)
    print("TEST 3: Create Sample Data")
    print("="*60)
    
    try:
        # Initialize repositories
        doc_repo = LegalDocumentRepository()
        article_repo = ArticleRepository()
        topic_repo = LegalTopicRepository()
        case_repo = CourtCaseRepository()
        
        # Create a legal topic
        print("\n📝 Creating legal topic...")
        topic = await topic_repo.create(
            name="Hukum Pidana Umum",
            description="Topik tentang hukum pidana secara umum",
            domain="Pidana"
        )
        print(f"✅ Created topic: {topic.name if hasattr(topic, 'name') else 'Success'}")
        
        # Create a legal document
        print("\n📖 Creating legal document...")
        doc = await doc_repo.create(
            title="UU No. 1 Tahun 2023 tentang Kitab Undang-Undang Hukum Pidana",
            doc_type="UU",
            number="No. 1 Tahun 2023",
            year=2023,
            summary="Undang-undang tentang Kitab Undang-Undang Hukum Pidana yang baru",
            content="[Full text will be here...]",
            domain="Pidana",
            source_url="https://jdihn.go.id/",
            status="Active"
        )
        print(f"✅ Created document: {doc.title if hasattr(doc, 'title') else 'Success'}")
        
        # Create articles
        print("\n📄 Creating articles...")
        
        # Get document ID (handle both object and tuple return)
        doc_id = str(doc.id) if hasattr(doc, 'id') else str(doc[0] if isinstance(doc, tuple) else doc)
        
        articles_data = [
            {
                "number": "Pasal 1",
                "content": "Dalam Undang-Undang ini yang dimaksud dengan Tindak Pidana adalah...",
                "section": "Bab I - Ketentuan Umum"
            },
            {
                "number": "Pasal 2",
                "content": "Setiap orang yang melakukan tindak pidana...",
                "section": "Bab I - Ketentuan Umum"
            }
        ]
        
        for article_data in articles_data:
            article = await article_repo.create(
                number=article_data["number"],
                content=article_data["content"],
                document_id=doc_id,
                section=article_data["section"]
            )
            print(f"  ✅ Created article: {article_data['number']}")
        
        # Create a court case
        print("\n⚖️ Creating court case...")
        court_case = await case_repo.create(
            case_number="123/Pid.Sus/2023/PN Jkt.Sel",
            title="Perkara Pidana Umum",
            court_level="PengadilanNegeri",
            summary="Terdakwa dituduh melakukan tindak pidana...",
            decision="Menyatakan terdakwa bersalah...",
            court_name="Pengadilan Negeri Jakarta Selatan",
            domain="Pidana",
            is_landmark=False
        )
        print(f"✅ Created court case: {court_case.case_number if hasattr(court_case, 'case_number') else 'Success'}")
        
        print("\n✅ Sample data creation test PASSED")
        return True
        
    except Exception as e:
        print(f"\n❌ Sample data creation test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False


async def test_search_operations():
    """Test search operations."""
    print("\n" + "="*60)
    print("TEST 4: Search Operations")
    print("="*60)
    
    try:
        doc_repo = LegalDocumentRepository()
        
        # Search documents
        print("\n🔍 Searching documents with keyword 'pidana'...")
        results = await doc_repo.search(keyword="pidana", limit=5)
        
        print(f"Found {len(results)} documents:")
        for i, doc in enumerate(results, 1):
            title = doc.title if hasattr(doc, 'title') else str(doc)
            print(f"  {i}. {title}")
        
        # Get recent documents
        print("\n📅 Getting recent documents...")
        recent = await doc_repo.get_recent(limit=5)
        
        print(f"Found {len(recent)} recent documents:")
        for i, doc in enumerate(recent, 1):
            title = doc.title if hasattr(doc, 'title') else str(doc)
            print(f"  {i}. {title}")
        
        print("\n✅ Search operations test PASSED")
        return True
        
    except Exception as e:
        print(f"\n❌ Search operations test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False


async def run_all_tests():
    """Run all tests."""
    print("\n" + "="*60)
    print("🧪 EDGEDB SETUP & OPERATIONS TEST SUITE")
    print("="*60)
    
    # Initialize connection
    await init_edgedb()
    
    # Run tests
    tests = [
        ("Basic Connection", test_basic_connection),
        ("Database Info", test_database_info),
        ("Create Sample Data", test_create_sample_data),
        ("Search Operations", test_search_operations)
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
        print("\n🎉 All tests PASSED! EdgeDB is ready to use.")
    else:
        print(f"\n⚠️ {total - passed} test(s) failed. Please check the errors above.")
    
    # Close connection
    await close_edgedb()
    
    return passed == total


if __name__ == "__main__":
    print("\n🚀 Starting EdgeDB Test Suite...")
    
    try:
        success = asyncio.run(run_all_tests())
        
        if success:
            print("\n✅ EdgeDB setup is complete and working!")
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
