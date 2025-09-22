"""
Simple test server untuk Pasalku AI Backend
"""
import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Simple FastAPI app
app = FastAPI(
    title="Pasalku AI Test API",
    description="Test Backend API untuk Pasalku AI",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Pasalku AI Backend is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Server is running"}

@app.post("/api/auth/login")
async def login_test():
    return {
        "access_token": "test-token-123",
        "token_type": "bearer",
        "user": {
            "email": "test@pasalku.ai",
            "role": "public"
        }
    }

@app.post("/api/auth/register")
async def register_test():
    return {
        "message": "User registered successfully",
        "user": {
            "email": "test@pasalku.ai",
            "role": "public"
        }
    }

@app.post("/api/chat/query")
async def chat_test():
    return {
        "response": "Ini adalah response test dari AI. Backend server berjalan dengan baik!",
        "source_documents": ["Test document 1", "Test document 2"],
        "citations": ["Pasal 1", "Undang-Undang No. 1 Tahun 1946"]
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    logger.info(f"Starting test server on port {port}")
    uvicorn.run("test_server:app", host="0.0.0.0", port=port, reload=True)
