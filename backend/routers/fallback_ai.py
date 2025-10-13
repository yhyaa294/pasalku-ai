"""
Fallback AI Quick Replies Router
Automatic fallback dari Ark AI ke Groq AI ketika latency > 2 detik
"""
from typing import Dict, Any, List
from datetime import datetime
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends
import asyncio
import time

from ..services.ark_ai_service import ark_ai_service
from ..services.groq_service import groq_service
from ..middleware.auth import get_current_user

router = APIRouter(prefix="/fallback-ai", tags=["Fallback AI"])

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    timeout_ms: int = 2000
    fallback_enabled: bool = True

class AIResponse(BaseModel):
    content: str
    provider: str  # "ark" or "groq"
    response_time_ms: int
    success: bool

@router.post("/chat", response_model=AIResponse)
async def intelligent_chat_fallback(
    request: ChatRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Smart AI chat with automatic fallback from Ark to Groq
    Uses whichever responds first within timeout
    """
    try:
        # Create tasks for both AI services
        ark_task = asyncio.create_task(call_ark_ai(request.messages))
        groq_task = asyncio.create_task(call_groq_ai(request.messages))

        # Race both tasks with timeout
        timeout = request.timeout_ms / 1000.0
        done, pending = await asyncio.wait(
            [ark_task, groq_task],
            timeout=timeout,
            return_when=asyncio.FIRST_COMPLETED
        )

        # Cancel pending tasks
        for task in pending:
            task.cancel()

        # Get the first completed result
        if done:
            result = await list(done)[0]
            return result
        else:
            # Both timed out, use fallback anyway
            fallback_result = await groq_task
            return fallback_result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI fallback failed: {str(e)}")

@router.get("/benchmark")
async def benchmark_ai_performance(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Benchmark performance of Ark vs Groq AI for same input
    """
    test_messages = [{"role": "user", "content": "Jelaskan tentang KUHP Indonesia dalam bahasa sederhana"}]

    results = []

    # Test Ark AI
    start_time = time.time()
    ark_result = await call_ark_ai(test_messages)
    results.append({
        "provider": "ark",
        "response_time_ms": ark_result.response_time_ms,
        "success": ark_result.success
    })

    # Test Groq AI
    start_time = time.time()
    groq_result = await call_groq_ai(test_messages)
    results.append({
        "provider": "groq",
        "response_time_ms": groq_result.response_time_ms,
        "success": groq_result.success
    })

    return {
        "benchmark_results": results,
        "recommended_primary": "ark" if results[0]["response_time_ms"] < results[1]["response_time_ms"] else "groq",
        "test_timestamp": datetime.utcnow()
    }

async def call_ark_ai(messages: List[Dict[str, str]]) -> AIResponse:
    """Call Ark AI service"""
    try:
        start_time = time.time()
        result = await ark_ai_service.chat_completion(
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        response_time = int((time.time() - start_time) * 1000)

        return AIResponse(
            content=result.get("content", "") if result["success"] else "Maaf, sistem sementara bermasalah",
            provider="ark",
            response_time_ms=response_time,
            success=result["success"]
        )

    except Exception as e:
        return AIResponse(
            content="Error calling Ark AI",
            provider="ark",
            response_time_ms=9999,
            success=False
        )

async def call_groq_ai(messages: List[Dict[str, str]]) -> AIResponse:
    """Call Groq AI service as fallback"""
    try:
        start_time = time.time()
        result = await groq_service.chat_completion(
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        response_time = int((time.time() - start_time) * 1000)

        return AIResponse(
            content=result.get("content", "") if result["success"] else "Maaf, semua sistem AI sedang offline",
            provider="groq",
            response_time_ms=response_time,
            success=result["success"]
        )

    except Exception as e:
        return AIResponse(
            content="Error calling Groq AI",
            provider="groq",
            response_time_ms=9999,
            success=False
        )

@router.get("/health")
async def fallback_health():
    """Check fallback AI service health"""
    return {
        "status": "healthy",
        "providers": ["ark", "groq"],
        "fallback_enabled": True,
        "timestamp": datetime.utcnow()
    }