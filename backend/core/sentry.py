import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from ..core.config import settings

def init_sentry():
    """Initialize Sentry with proper configuration"""
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment="production",  # Can be configured based on settings
        traces_sample_rate=1.0,  # Adjust based on traffic
        profiles_sample_rate=1.0,
        
        # Enable integrations
        integrations=[
            FastApiIntegration(
                transaction_style="endpoint",
                middleware_span_enabled=True
            ),
            SqlalchemyIntegration()
        ],
        
        # Configure additional settings
        send_default_pii=False,  # Don't send personally identifiable information
        attach_stacktrace=True,
        max_breadcrumbs=50,
        
        # Set your release version
        release=f"pasalku-ai@{settings.APP_VERSION}",
        
        # Configure sampling
        traces_sampler=_traces_sampler
    )
    
    # Set Sentry user scope for organization
    sentry_sdk.set_tag("organization", settings.SENTRY_ORG)
    sentry_sdk.set_tag("project", settings.SENTRY_PROJECT)

def _traces_sampler(sampling_context):
    """Custom sampling function for Sentry performance monitoring"""
    # Path-based sampling
    if "wsgi_environ" in sampling_context:
        path = sampling_context["wsgi_environ"].get("PATH_INFO", "")
        
        # Always sample error endpoints
        if "/error" in path:
            return 1.0
        
        # Sample health checks less frequently
        if "/health" in path:
            return 0.01
        
        # Sample static files less
        if "/static/" in path:
            return 0.1
        
        # Sample API endpoints more frequently
        if "/api/" in path:
            return 0.5
    
    # Default to 10% sampling
    return 0.1

def capture_exception(
    error: Exception,
    context: dict = None,
    level: str = "error",
    user_id: str = None
):
    """Helper function to capture exceptions with context"""
    if context is None:
        context = {}
    
    with sentry_sdk.push_scope() as scope:
        # Add context
        for key, value in context.items():
            scope.set_extra(key, value)
        
        # Set severity level
        scope.set_level(level)
        
        # Set user context if available
        if user_id:
            scope.set_user({"id": user_id})
        
        # Capture exception
        sentry_sdk.capture_exception(error)