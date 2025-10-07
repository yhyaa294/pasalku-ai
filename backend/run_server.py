"""Start the Pasalku.ai backend with uvicorn.
This binds to 0.0.0.0 and the PORT env var (default 8001).
"""
import os
import uvicorn

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8001"))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("backend.server:app", host=host, port=port, reload=True)
