"""
Script untuk memverifikasi koneksi sistem inti Pasalku.ai
"""
import sys
import asyncio
from typing import List, Dict, Any
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("system-check")

async def check_database():
    """Verifikasi koneksi ke database."""
    try:
        from backend.database import SessionLocal, engine
        from backend.models import Base
        
        from sqlalchemy import text
        
        # Test database connection
        Base.metadata.create_all(bind=engine)
        with SessionLocal() as db:
            result = db.execute(text("SELECT 1"))
            db.commit()
        
        logger.info("✅ Database connection successful")
        return True
    except Exception as e:
        logger.error(f"❌ Database connection failed: {str(e)}")
        return False

async def check_ai_service():
    """Verifikasi koneksi ke layanan AI."""
    try:
        from backend.services.ai_service import ai_service
        
        # Test simple prompt
        query = "Berikan satu nasihat hukum umum tentang pentingnya dokumentasi dalam perjanjian."
        response = await ai_service.get_legal_response(query)
        
        if response and "answer" in response and len(response["answer"]) > 0:
            logger.info("✅ AI service connection successful")
            logger.info(f"Sample response: {response['answer'][:100]}...")
            return True
        else:
            logger.error("❌ AI service returned empty response")
            return False
    except Exception as e:
        logger.error(f"❌ AI service connection failed: {str(e)}")
        return False

async def check_sentry():
    """Verifikasi konfigurasi Sentry."""
    try:
        import sentry_sdk
        from backend.core.config import settings
        
        # Initialize Sentry if not already initialized
        if not sentry_sdk.get_client():
            sentry_sdk.init(
                dsn=settings.NEXT_PUBLIC_SENTRY_DSN,
                environment=settings.ENVIRONMENT,
                traces_sample_rate=1.0 if settings.ENVIRONMENT == "development" else 0.1,
                send_default_pii=False
            )
        
        # Test Sentry configuration
        sentry_client = sentry_sdk.get_client()
        if sentry_client and sentry_client.dsn:
            # Test error reporting
            try:
                raise Exception("Test error for Sentry verification")
            except Exception as e:
                sentry_sdk.capture_exception(e)
                
            logger.info("✅ Sentry configuration successful")
            return True
        
        logger.error("❌ Sentry not properly configured")
        return False
    except Exception as e:
        logger.error(f"❌ Sentry check failed: {str(e)}")
        return False

async def check_translation_service():
    """Verifikasi translation service."""
    try:
        from backend.services.translation_service import translation_service
        
        # Test text
        test_text = "Halo, apa kabar?"
        
        # Test translation to primary (should be no-op for id->id)
        result_primary = await translation_service.translate_to_primary(test_text, source_lang="id")
        
        # Test translation from primary to English (if Groq available)
        result_en = await translation_service.translate_to_user(test_text, target_lang="en")
        
        logger.info(f"✅ Translation service initialized")
        logger.info(f"   Available providers: {translation_service.providers or ['identity (dev mode)']}")
        logger.info(f"   Primary provider: {translation_service.primary_provider}")
        logger.info(f"   Test translation (id): {result_primary}")
        logger.info(f"   Test translation (en): {result_en}")
        
        return True
    except Exception as e:
        logger.error(f"❌ Translation service check failed: {str(e)}")
        return False

async def check_mongodb():
    """Verifikasi koneksi MongoDB."""
    try:
        from backend.database import get_mongo_client
        
        mongo_client = get_mongo_client()
        if not mongo_client:
            logger.warning("⚠️ MongoDB not configured (optional)")
            return True  # Not critical, so return True
        
        # Test connection with ping
        mongo_client.admin.command('ping')
        
        logger.info("✅ MongoDB connection successful")
        return True
    except Exception as e:
        logger.warning(f"⚠️ MongoDB connection check failed (optional): {str(e)}")
        return True  # Not critical, so return True

async def main():
    """Jalankan semua pemeriksaan sistem."""
    logger.info("🔍 Starting system verification...")
    
    # Run all checks
    checks = [
        ("Database (PostgreSQL)", check_database()),
        ("AI Service", check_ai_service()),
        ("Translation Service", check_translation_service()),
        ("MongoDB (Optional)", check_mongodb()),
        ("Sentry", check_sentry())
    ]
    
    results = []
    for name, check in checks:
        logger.info(f"\n=== Checking {name} ===")
        result = await check
        results.append((name, result))
    
    # Print summary
    logger.info("\n=== System Check Summary ===")
    all_passed = True
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        logger.info(f"{name}: {status}")
        if not result:
            all_passed = False
    
    if all_passed:
        logger.info("\n✨ All systems operational!")
        return 0
    else:
        logger.error("\n⚠️ Some systems failed verification")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)