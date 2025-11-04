"""
Standalone test server for Legal Terms API
This bypasses the main server.py import issues
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
import importlib.util

# Add backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

# Import terms router directly without going through __init__.py
spec = importlib.util.spec_from_file_location("terms", os.path.join(backend_dir, "routers", "terms.py"))
terms_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(terms_module)

# Create minimal FastAPI app
app = FastAPI(
    title="Legal Terms API Test Server",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include terms router
app.include_router(terms_module.router, prefix="/api/terms", tags=["Legal Terms"])

# Health check
@app.get("/health")
async def health():
    return {"status": "ok", "message": "Legal Terms API is running"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Legal Terms Test Server...")
    print("📖 API Docs: http://localhost:8001/docs")
    print("🔍 Health Check: http://localhost:8001/health")
    print("\n✨ Testing endpoints:")
    print("  POST /api/terms/detect")
    print("  GET  /api/terms/term/{term_name}")
    print("  GET  /api/terms/search?q=...")
    print("  GET  /api/terms/categories")
    print("\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
