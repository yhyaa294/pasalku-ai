# Features → Backend API map

This document maps visible features in the UI to backend endpoints and notes status/gaps.

- AI Chat Konsultasi
  - UI: /ai-chat
  - Front API: POST /api/chat (accepts application/json and multipart/form-data)
  - Backend: backend/routers/chat_updated.py
    - POST /api/chat (JSON mock-compatible), POST /api/chat/consult, GET /api/chat/history, etc.

- Auto Citation Detection
  - UI entry: Features Hub / AI Chat
  - Backend: backend/routers/citations.py (prefix /api/citations)
    - POST /enhance, POST /detect, POST /extract, GET /statistics, GET /trending, GET /types, GET /formats

- Outcome Prediction
  - UI entry: Features Hub / AI Chat
  - Backend: backend/routers/prediction.py and backend/routers/legal_prediction.py
    - prediction.py: POST /predict, /analyze, /precedents, /quick-predict, GET /outcomes, /health
    - legal_prediction.py: POST /predict-case-outcome, /judge-behavior-analysis, /settlement-optimization, GET /prediction-statistics

- Document Generator
  - UI: /templates (and via chat context)
  - Backend: backend/routers/document_gen.py
    - GET /templates, GET /templates/{id}, POST /templates, POST /generate, POST /validate, POST /preview, GET /download/{file_path}

- Smart Document Upload / Analysis
  - UI: /documents/upload (planned)
  - Backend: backend/routers/documents.py
    - POST /upload, GET /{document_id}, GET /

- Legal Translation (and readability, terms explain)
  - UI entry: Features Hub / AI Chat
  - Backend: backend/routers/language_translator.py
    - POST /simplify-legal-text, POST /translate-multilingual, POST /explain-legal-terms, POST /improve-readability

- Strategic Assessment Intelligence (Beta)
  - UI: Features Hub (request beta)
  - Backend candidates: backend/routers/advanced_ai.py, backend/routers/ai_consensus.py, backend/routers/reasoning_chain.py
    - advanced_ai.py: advanced analysis endpoints + /health + /capabilities
    - ai_consensus.py: POST /consensus, /consensus/simple, GET /models/info, /health
    - reasoning_chain.py: POST /analyze-reasoning-chain, /validate-evidence-chain, /generate-logical-counter, GET /logical-fallacies

- Analytics Dashboard (Coming soon)
  - UI: /analytics (placeholder)
  - Backend: backend/routers/analytics.py
    - POST /track, /log-activity, GET /summary, /popular-topics, /language-distribution, /prediction-stats, /citation-stats, /dashboard-data, etc.

- Virtual Court Simulation (Coming soon)
  - UI: Features Hub → Upgrade/Contact
  - Backend: Not implemented yet (planned). Candidates: create a new router (e.g., virtual_court.py) with basic stubs.

Notes
- Frontend mocks are available for /api/chat and a few stub routes (citations, predictions, translation) to enable front-first development even without the backend running.
- Health check: GET /api/status from Next.js will try to detect backend connectivity when configured via env (NEXT_PUBLIC_API_URL/BACKEND_URL).
