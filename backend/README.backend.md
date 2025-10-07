# Pasalku.ai Backend

Quick notes to run the backend locally for development.

Required environment variables (recommended to put in `.env` in repo root):

- SECRET_KEY - JWT secret
- DATABASE_URL - SQLAlchemy DB URL (defaults to sqlite:///./sql_app.db)
- ARK_API_KEY - BytePlus Ark API key (optional for AI; when missing ai falls back)
- ARK_BASE_URL - BytePlus Ark base URL (optional)
- ARK_MODEL_ID - BytePlus Ark model id (optional)
- MONGO_URL - MongoDB connection URL (optional; logs consults)
- PORT - Port to run (defaults to 8001)
- ENVIRONMENT - development/production

Run locally (PowerShell):

```powershell
# from repo root
python -m backend.server
# or use run_server helper
python backend/run_server.py
```

The app binds to 0.0.0.0 and uses /api prefix for docs at /api/docs.

If ARK_API_KEY is not set the AI endpoints will return a graceful fallback message.
