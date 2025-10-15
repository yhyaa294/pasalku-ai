#!/usr/bin/env python3
"""
Pasalku AI Backend Server - Startup Script
Run this from the PROJECT ROOT directory, not from backend/
"""

import sys
import os
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Now import and run the server
if __name__ == "__main__":
    print(f"🚀 Starting Pasalku AI Backend Server...")
    print(f"📁 Project root: {project_root}")
    print(f"🐍 Python path: {sys.path[0]}")
    print("-" * 50)
    
    # Import after path is set
    from backend.server import app
    import uvicorn
    
    # Run server
    uvicorn.run(
        "backend.server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
