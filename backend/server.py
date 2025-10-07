import os
import asyncio
import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import uuid4, UUID

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# MongoDB (async)
import motor.motor_asyncio
from pymongo.errors import PyMongoError

# BytePlus Ark SDK
try:
    from byteplussdk.arkruntime import Ark  # preferred import path
except Exception:  # fallback if package exposes flat module path in some versions
    from byteplussdkarkruntime import Ark  # type: ignore


# ----- Logging -----
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("pasalku-backend")


# ----- Environment -----
MONGO_URL = os.environ.get("MONGO_URL")
if not MONGO_URL:
    logger.error("MONGO_URL env var is required but not set. Please set backend/.env accordingly.")

ARK_API_KEY = os.environ.get("ARK_API_KEY")
ARK_BASE_URL = os.environ.get("ARK_BASE_URL", "https://ark.ap-southeast.bytepluses.com/api/v3")
ARK_MODEL_ID = os.environ.get("ARK_MODEL_ID", "ep-20250830093230-swczp")

# Bind config per environment rules
BIND_HOST = "0.0.0.0"
BIND_PORT = 8001


# ----- App -----
app = FastAPI(
    title="Pasalku.ai Backend",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# CORS: allow frontend ingress to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"];
    allow_headers=["*"]
)


# ----- Global state -----
client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
mongo_db = None
ark_client: Optional[Ark] = None


# ----- Startup/Shutdown -----
@app.on_event("startup")
async def on_startup():
    global client, mongo_db, ark_client

    if not MONGO_URL:
        # Fail fast; platform guarantees presence, but guard anyway
        raise RuntimeError("MONGO_URL is not configured")

    try:
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
        # Prefer default DB from URI; if missing, fall back to named 'app'
        mongo_db = client.get_default_database() or client.get_database("app")
        # Ping to verify connectivity
        await client.admin.command("ping")
        logger.info("Connected to MongoDB successfully")
    except Exception as e:
        logger.exception("Failed connecting to MongoDB: %s", e)
        raise

    try:
        if not ARK_API_KEY:
            logger.warning("ARK_API_KEY not set; /api/consult will return 503 until configured")
        else:
            ark_client = Ark(api_key=ARK_API_KEY, base_url=ARK_BASE_URL)
            logger.info("Initialized BytePlus Ark client")
    except Exception as e:
        logger.exception("Failed initializing Ark client: %s", e)
        raise


@app.on_event("shutdown")
async def on_shutdown():
    global client
    if client:
        client.close()
        logger.info("MongoDB client closed")


# ----- Helpers -----
async def ark_chat_completion(messages: List[Dict[str, str]]) -> Dict[str, Any]:
    if not ark_client or not ARK_API_KEY:
        raise HTTPException(status_code=503, detail="AI service not configured")

    loop = asyncio.get_event_loop()

    def _call():
        # Blocking SDK call executed in threadpool
        return ark_client.chat.completions.create(
            model=ARK_MODEL_ID,
            messages=messages,
        )

    try:
        resp = await loop.run_in_executor(None, _call)
        # Normalize response to JSON serializable dict
        result = {
            "id": getattr(resp, "id", None),
            "created": getattr(resp, "created", None),
            "model": getattr(resp, "model", None),
            "choices": [
                {
                    "index": c.index,
                    "message": {
                        "role": c.message.role,
                        "content": c.message.content,
                    },
                    "finish_reason": getattr(c, "finish_reason", None),
                }
                for c in getattr(resp, "choices", [])
            ],
            "usage": {
                "prompt_tokens": getattr(getattr(resp, "usage", None), "prompt_tokens", None),
                "completion_tokens": getattr(getattr(resp, "usage", None), "completion_tokens", None),
                "total_tokens": getattr(getattr(resp, "usage", None), "total_tokens", None),
            },
        }
        return result
    except Exception as e:
        logger.exception("Ark chat completion error: %s", e)
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")


# ----- Routes (all prefixed with /api) -----
@app.get("/api/health")
async def health():
    return {"status": "ok", "time": datetime.utcnow().isoformat()}


@app.post("/api/consult")
async def consult(payload: Dict[str, Any]):
    """
    Body:
    {
      "query": "text",
      "session_id": "optional UUID string",
      "system_prompt": "optional system instructions"
    }
    """
    query = (payload or {}).get("query", "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="Field 'query' is required")

    # Manage session id as UUID string (do not use ObjectId)
    session_id_str = (payload or {}).get("session_id") or str(uuid4())
    try:
        session_uuid = UUID(session_id_str)
    except Exception:
        session_uuid = uuid4()
        session_id_str = str(session_uuid)

    system_prompt = (payload or {}).get("system_prompt") or (
        "You are Pasalku.ai, an Indonesian legal AI assistant. "
        "Provide answers with clear, plain Indonesian explanations, include relevant Indonesian legal citations "
        "(UU/Peraturan/Putusan) when applicable. Add a short disclaimer: 'Bukan nasihat hukum, konsultasikan dengan profesional.'"
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": query},
    ]

    result = await ark_chat_completion(messages)

    # Extract answer text (fallback to empty string)
    answer = ""
    if result.get("choices"):
        answer = result["choices"][0]["message"].get("content", "")

    # Persist log to Mongo (best-effort)
    try:
        doc = {
            "id": str(uuid4()),  # standalone UUID for the log entry
            "session_id": session_id_str,
            "query": query,
            "answer": answer,
            "usage": result.get("usage"),
            "created_at": datetime.utcnow().isoformat(),
        }
        await mongo_db["consult_logs"].insert_one(doc)
    except PyMongoError as e:
        logger.warning("Failed to write consult log: %s", e)

    return {
        "session_id": session_id_str,
        "answer": answer,
        "raw": result,
        "disclaimer": "Informasi ini bukan merupakan nasihat hukum. Konsultasikan dengan profesional hukum.",
    }


# Root for quick check (not under /api)
@app.get("/")
async def root():
    return {"service": "Pasalku.ai Backend", "docs": "/api/docs"}
