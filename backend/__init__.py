"""
Package utama untuk aplikasi Pasalku AI Backend.
"""

__version__ = "0.1.0"

# Ekspor modul utama
from .app import app
from .database import SessionLocal, engine

__all__ = ["app", "SessionLocal", "engine"]
