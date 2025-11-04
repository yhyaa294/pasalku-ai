# LEGACY ENDPOINTS MOVED FROM server.py

These endpoints were commented out from the main server.py file because they rely on services/methods
that are not implemented in the basic AIService.

These features ARE implemented through the proper routers:
- `routers/consultation.py` - Handles consultation flow using services/consultation_flow.py
- `routers/ai_consensus.py` - Dual AI consensus
- `routers/reasoning_chain.py` - Reasoning chain analysis
- `routers/adaptive_personas.py` - Adaptive personas

If you need structured consultation, use the endpoints from `routers/consultation.py`:
- POST /api/consultation/start
- POST /api/consultation/continue
- GET /api/consultation/history

For advanced AI features, use dedicated router endpoints with `/api/` prefix.

DO NOT uncomment these legacy endpoints without first implementing the missing methods
in AIService or migrating them properly to their respective routers.
