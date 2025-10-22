"""
Sentry Configuration Module for Pasalku.ai Backend
"""
import logging
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from sentry_sdk.integrations.logging import LoggingIntegration

from backend.core.config import settings

logger = logging.getLogger(__name__)

def init_sentry():
    """
    Initialize Sentry for error monitoring.
    This should be called during application startup.
    """
    if settings.NEXT_PUBLIC_SENTRY_DSN:
        try:
            sentry_logging = LoggingIntegration(
                level=logging.INFO,        # Capture info and above as breadcrumbs
                event_level=logging.ERROR  # Send errors as events
            )
            
            sentry_sdk.init(
                dsn=settings.NEXT_PUBLIC_SENTRY_DSN,
                environment=settings.ENVIRONMENT,
                integrations=[
                    FastApiIntegration(transaction_style="endpoint"),
                    SqlalchemyIntegration(),
                    sentry_logging
                ],
                traces_sample_rate=1.0 if settings.ENVIRONMENT == "development" else 0.1,
                profiles_sample_rate=1.0 if settings.ENVIRONMENT == "development" else 0.1,  # Profiling
                send_default_pii=False,  # Don't send personally identifiable information
            )
            
            logger.info("Sentry initialized successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to initialize Sentry: {str(e)}")
            return False
    else:
        logger.warning("Sentry DSN not configured, skipping Sentry initialization")
        return False

def capture_exception(exception: Exception, extra: dict = None):
    """
    Capture an exception with Sentry
    
    Args:
        exception: The exception to capture
        extra: Additional data to include with the exception
    """
    try:
        sentry_sdk.set_extra('additional_context', extra or {})
        sentry_sdk.capture_exception(exception)
    except Exception as e:
        logger.error(f"Failed to capture exception with Sentry: {str(e)}")

def set_user(user_data: dict):
    """
    Set user data for Sentry error tracking
    
    Args:
        user_data: Dictionary with user information (id, email, etc.)
    """
    try:
        sentry_sdk.set_user(user_data)
    except Exception as e:
        logger.error(f"Failed to set user data for Sentry: {str(e)}")

def add_breadcrumb(message: str, category: str = "custom", level: str = "info", data: dict = None):
    """
    Add a breadcrumb to the current Sentry context
    
    Args:
        message: The message for the breadcrumb
        category: The category for the breadcrumb
        level: The level for the breadcrumb (info, warning, error, etc.)
        data: Additional data to include with the breadcrumb
    """
    try:
        sentry_sdk.add_breadcrumb(
            message=message,
            category=category,
            level=level,
            data=data
        )
    except Exception as e:
        logger.error(f"Failed to add breadcrumb to Sentry: {str(e)}")