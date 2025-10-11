from typing import Dict, Any, Optional
import statsig
from ..core.config import settings

class ExperimentationService:
    def __init__(self):
        # Initialize Statsig
        statsig.initialize(
            settings.STATSIG_SERVER_API_KEY,
            
            # Configure options
            options={
                "environment": {
                    "tier": "production"  # or "staging", "development"
                },
                "local_mode": False,  # Set to True for development
                "rulesets_sync_interval": 10,  # Sync rules every 10 seconds
                "logging_interval": 10,  # Log events every 10 seconds
                "logging_max_buffer_size": 500  # Buffer up to 500 events
            }
        )

    async def check_gate(
        self,
        gate_name: str,
        user_id: str,
        user_properties: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Check if a feature gate is enabled for a user"""
        try:
            user = self._create_statsig_user(user_id, user_properties)
            return statsig.check_gate(user, gate_name)
        except Exception as e:
            # Log error and return default value (False)
            import sentry_sdk
            sentry_sdk.capture_exception(e)
            return False

    async def get_experiment(
        self,
        experiment_name: str,
        user_id: str,
        user_properties: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Get experiment configuration for a user"""
        try:
            user = self._create_statsig_user(user_id, user_properties)
            return statsig.get_experiment(user, experiment_name)
        except Exception as e:
            import sentry_sdk
            sentry_sdk.capture_exception(e)
            return {}

    async def get_config(
        self,
        config_name: str,
        user_id: str,
        user_properties: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Get dynamic config for a user"""
        try:
            user = self._create_statsig_user(user_id, user_properties)
            return statsig.get_config(user, config_name)
        except Exception as e:
            import sentry_sdk
            sentry_sdk.capture_exception(e)
            return {}

    async def log_event(
        self,
        event_name: str,
        user_id: str,
        value: Optional[Any] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """Log custom event for analysis"""
        try:
            user = self._create_statsig_user(user_id)
            statsig.log_event(user, event_name, value, metadata)
        except Exception as e:
            import sentry_sdk
            sentry_sdk.capture_exception(e)

    def _create_statsig_user(
        self,
        user_id: str,
        properties: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Create a Statsig user object"""
        user = {
            "userID": str(user_id)
        }
        
        if properties:
            user["custom"] = properties
        
        return user