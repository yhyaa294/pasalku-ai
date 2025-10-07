import os
import asyncio
import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import uuid4, UUID

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Optional MongoDB (async) for logging; operate gracefully if absent
mongo_available = True
try:
    import motor.motor_asyncio
    from pymongo.errors import PyMongoError
except Exception:  # motor not available
    mongo_available = False
    motor = None
    PyMongoError = Exception

# BytePlus Ark SDK
from byteplussdkarkruntime import Ark

# Existing project modules
from database import init_db
from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.chat import router as chat_router

# ----- Logging -----
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("pasalku-backend")

# ----- Environment -----
MONGO_URL = os.environ.get("MONGO_URL")
ARK_API_KEY = os.environ.get("ARK_API_KEY")
ARK_BASE_URL = os.environ.get("ARK_BASE_URL", "https://ark.ap-southeast.bytepluses.com/api/v3")
ARK_MODEL_ID = os.environ.get("ARK_MODEL_ID", "ep-20250830093230-swczp")

# Bind config per environment rules
BIND_HOST = "0.0.0.0"
BIND_PORT = 8001

# ----- App -----
app = FastAPI(
    title="Pasalku.ai Backend",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# CORS: allow frontend ingress to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ----- Global state -----
client: Optional["motor.motor_asyncio.AsyncIOMotorClient"] = None
mongo_db = None
ark_client: Optional[Ark] = None

# ----- Startup/Shutdown -----
@app.on_event("startup")
async def on_startup():
    global client, mongo_db, ark_client

    # Initialize SQL database tables
    try:
        init_db()
        logger.info("SQL database initialized")
    except Exception as e:
        logger.warning(f"SQL database init warning: {e}")

    # Try to connect MongoDB (optional)
    if mongo_available and MONGO_URL:
        try:
            client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
            mongo_db = client.get_default_database() or client.get_database("app")
            await client.admin.command("ping")
            logger.info("Connected to MongoDB successfully")
        except Exception as e:
            logger.warning("MongoDB not available: %s", e)
            client = None
            mongo_db = None
    else:
        logger.info("MongoDB logging disabled (driver or MONGO_URL missing)")

    # Ark client
    if not ARK_API_KEY:
        logger.warning("ARK_API_KEY not set; /api/consult will return 503 until configured")
    else:
        try:
            ark_client = Ark(api_key=ARK_API_KEY, base_url=ARK_BASE_URL)
            logger.info("Initialized BytePlus Ark client")
        except Exception as e:
            logger.exception("Failed initializing Ark client: %s", e)
            ark_client = None


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


# ----- Consolidated Routes (all prefixed with /api) -----
# Existing routers from project
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])


@app.get("/api/health")
async def health():
    return {"status": "ok", "time": datetime.utcnow().isoformat()}


@app.post("/api/consult")
async def consult(payload: Dict[str, Any]):
    """
    Public legal consultation endpoint (no auth).
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
        UUID(session_id_str)
    except Exception:
        session_id_str = str(uuid4())

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
    if mongo_db is not None:
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
