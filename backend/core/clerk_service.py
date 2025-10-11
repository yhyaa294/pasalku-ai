"""
Clerk Authentication Service untuk FastAPI
Integrasi dengan Clerk untuk authentication yang lebih advanced
"""
import logging
from typing import Optional, Dict, Any, List
import httpx
import jwt
from jwt import PyJWKClient

from backend.core.config import settings

logger = logging.getLogger(__name__)

class ClerkService:
    """Service untuk integrasi dengan Clerk authentication"""

    def __init__(self):
        self.secret_key = settings.CLERK_SECRET_KEY
        self.publishable_key = settings.CLERK_PUBLISHABLE_KEY
        self.base_url = "https://api.clerk.dev/v1"

        # Initialize JWKS client for JWT verification
        self.jwks_client = PyJWKClient(
            "https://clerk.ist.my.clerk.accounts.dev/.well-known/jwks.json"
        )

        logger.info("Clerk service initialized successfully")

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Verify JWT token from Clerk
        Returns user data if valid, None if invalid
        """
        try:
            # Get signing key
            signing_key = self.jwks_client.get_signing_key_from_jwt(token)

            # Decode token
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                audience="clerk",
                options={"verify_exp": True}
            )

            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("JWT token has expired")
            return None
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid JWT token: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error verifying Clerk token: {str(e)}")
            return None

    async def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get user details from Clerk API
        """
        if not self.secret_key:
            logger.warning("Clerk secret key not configured")
            return None

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/users/{user_id}",
                    headers={
                        "Authorization": f"Bearer {self.secret_key}",
                        "Content-Type": "application/json"
                    }
                )

                if response.status_code == 200:
                    return response.json()
                else:
                    logger.warning(f"Failed to get user {user_id}: {response.text}")
                    return None

        except Exception as e:
            logger.error(f"Error getting user from Clerk: {str(e)}")
            return None

    async def get_user_metadata(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get user metadata from Clerk
        """
        user_data = await self.get_user(user_id)
        if not user_data:
            return None

        # Extract relevant metadata
        return {
            "clerk_id": user_data.get("id"),
            "email_addresses": user_data.get("email_addresses", []),
            "first_name": user_data.get("first_name"),
            "last_name": user_data.get("last_name"),
            "username": user_data.get("username"),
            "profile_image_url": user_data.get("profile_image_url"),
            "last_sign_in_at": user_data.get("last_sign_in_at"),
            "created_at": user_data.get("created_at"),
            "updated_at": user_data.get("updated_at")
        }

    def extract_user_id_from_token(self, token: str) -> Optional[str]:
        """
        Extract user ID from JWT token payload without full verification
        (for quick lookups)
        """
        try:
            # Decode without verification for user ID
            payload = jwt.decode(token, options={"verify_signature": False})
            return payload.get("sub")
        except Exception:
            return None

    async def sync_user_to_database(self, clerk_user_id: str, db_session) -> Optional[Dict[str, Any]]:
        """
        Sync Clerk user data to local database
        Returns user data dict or None if sync fails
        """
        from backend import crud

        # Get user metadata from Clerk
        metadata = await self.get_user_metadata(clerk_user_id)
        if not metadata:
            return None

        # Check if user already exists in our database
        email = metadata.get("email_addresses", [{}])[0].get("email_address", "")
        if not email:
            logger.warning(f"No email found for Clerk user {clerk_user_id}")
            return None

        user = crud.get_user_by_email(db_session, email=email)

        if not user:
            # Create new user
            full_name = f"{metadata.get('first_name', '')} {metadata.get('last_name', '')}".strip()

            user_create_data = {
                "email": email,
                "password": "clerk_auth",  # Placeholder password since auth is handled by Clerk
                "full_name": full_name or email.split('@')[0]
            }

            user = crud.create_user(db_session, crud.schemas.UserCreate(**user_create_data))
            logger.info(f"Created new user from Clerk: {email}")
        else:
            logger.info(f"Found existing user: {email}")

        return {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role.value if hasattr(user.role, 'value') else str(user.role),
            "is_active": bool(user.is_active),
            "clerk_metadata": metadata
        }

# Global instance
clerk_service = ClerkService()

async def get_clerk_user(token: str, db_session) -> Optional[Dict[str, Any]]:
    """
    Dependency function to get Clerk user from token and sync to database
    """
    # Extract user ID from token
    clerk_user_id = clerk_service.extract_user_id_from_token(token)
    if not clerk_user_id:
        return None

    # Verify token completely
    token_data = clerk_service.verify_token(token)
    if not token_data:
        return None

    # Sync user to our database
    user_data = await clerk_service.sync_user_to_database(clerk_user_id, db_session)

    return user_data