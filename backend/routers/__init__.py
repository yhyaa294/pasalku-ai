"""
Package untuk semua router API
"""
from .auth_updated import router as auth_router
from .chat_updated import router as chat_router
from .users import router as users_router
from .consultation import router as consultation_router

__all__ = ["auth_router", "chat_router", "users_router", "consultation_router"]
