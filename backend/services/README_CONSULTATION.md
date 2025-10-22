This folder contains the stateful consultation flow support for Pasalku.ai.

Overview
--------
We implemented a 4-step stateful consultation flow:
1) AWAITING_INITIAL_PROBLEM: user provides the initial problem
2) AWAITING_CLARIFICATION_ANSWERS: AI asks clarification questions and collects answers
3) AWAITING_SUMMARY_CONFIRMATION: AI produces a summary and asks for confirmation
4) AWAITING_EVIDENCE_CONFIRMATION -> ANALYSIS_COMPLETE: AI asks about evidence and produces final analysis

Files added/changed
------------------
- backend/services/consultation_flow.py : in-memory state machine + AI specialization stubs
- backend/models/consultation.py : added conversation_state (VARCHAR) and flow_context (JSON)
- backend/alembic/versions/20251020_add_conversation_state_flow_context.py : alembic migration to add DB columns
- backend/routers/consultation.py : loads/persists flow_context and conversation_state; new diagnostic endpoints

Migration notes
---------------
Run alembic upgrade head from the `backend/` folder. Example:

```powershell
# from project root
cd backend
# Ensure DB is reachable as configured in backend/alembic.ini
alembic upgrade head
```

If you cannot run migrations yet, the code will continue to work using an in-memory flow store. However, progress will be lost after server restart.

Testing the flow
----------------
1) Create a session via POST /api/consultation/sessions/create
2) Use POST /api/consultation/sessions/{session_id}/message to send initial problem
3) Follow returned questions, reply to them via the same endpoint until summary is returned
4) Confirm summary ("ya") and then answer evidence confirmation ("ada"/"tidak")
5) Read final_analysis in the response

Notes and next steps
--------------------
- Replace AI stubs (generate_clarification_questions, generate_conversation_summary, generate_final_analysis) with RAG + BytePlus Ark prompts.
- Add DB migration in production and run it safely (back up DB first).
- Consider storing transcript copy in MongoDB for auditing (already used elsewhere in the codebase).
