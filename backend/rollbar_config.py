"""
Rollbar configuration for Pasalku AI Backend
"""
import os
import rollbar
from rollbar.logger import RollbarHandler

def init_rollbar():
    """Initialize Rollbar for the FastAPI application"""

    # Get access token from environment
    access_token = os.getenv('ROLLBAR_SERVER_TOKEN', '950dc3101f764e478252db13e9f59687')

    if not access_token:
        print("Warning: ROLLBAR_SERVER_TOKEN not set. Rollbar will not be initialized.")
        return None

    # Initialize Rollbar
    rollbar.init(
        access_token=access_token,
        environment=os.getenv('ENVIRONMENT', 'development'),
        root=os.path.dirname(os.path.abspath(__file__)),
        allow_logging_basic_config=True
    )

    # Set up logging integration
    import logging
    logger = logging.getLogger(__name__)

    # Add Rollbar handler to root logger
    rollbar_handler = RollbarHandler()
    rollbar_handler.setLevel(logging.WARNING)
    logging.getLogger().addHandler(rollbar_handler)

    print(f"Rollbar initialized for environment: {os.getenv('ENVIRONMENT', 'development')}")
    return rollbar

# Global rollbar instance
rollbar_instance = init_rollbar()
