"""
Clerk Authentication Middleware dan RBAC
"""
import os
import logging
from typing import Optional, List
from fastapi import HTTPException, Security, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWKClient
from functools import wraps
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User, UserRole

logger = logging.getLogger(__name__)

# Clerk configuration
CLERK_PUBLISHABLE_KEY = os.getenv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY")
CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
CLERK_JWKS_URL = f"https://api.clerk.com/v1/jwks"

# Security scheme
security = HTTPBearer()


class ClerkAuth:
    """Clerk authentication handler"""
    
    def __init__(self):
        self.jwks_client = PyJWKClient(CLERK_JWKS_URL)
    
    def verify_token(self, token: str) -> dict:
        """
        Verify Clerk JWT token
        Returns decoded token payload
        """
        try:
            # Get signing key from Clerk JWKS
            signing_key = self.jwks_client.get_signing_key_from_jwt(token)
            
            # Decode and verify token
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                options={"verify_exp": True}
            )
            
            return payload
            
        except jwt.ExpiredSignatureError:
            logger.error("Token expired")
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.InvalidTokenError as e:
            logger.error(f"Invalid token: {str(e)}")
            raise HTTPException(status_code=401, detail="Invalid token")
        except Exception as e:
            logger.error(f"Token verification failed: {str(e)}")
            raise HTTPException(status_code=401, detail="Authentication failed")


# Global auth instance
clerk_auth = ClerkAuth()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user from Clerk token.
    Creates user in database if not exists (first login).
    """
    token = credentials.credentials
    
    # Verify token with Clerk
    payload = clerk_auth.verify_token(token)
    
    # Extract user info from token
    user_id = payload.get("sub")  # Clerk user ID
    email = payload.get("email")
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    # Get or create user in database
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        # First time login - create user
        user = User(
            id=user_id,
            email=email,
            full_name=payload.get("name"),
            role=UserRole.MASYARAKAT_UMUM,  # Default role
            is_email_verified=payload.get("email_verified", False)
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        logger.info(f"New user created: {user_id} ({email})")
    
    # Update last login
    from datetime import datetime
    user.last_login_at = datetime.utcnow()
    db.commit()
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get current active user (must be active)
    """
    if not current_user.is_active:
        raise HTTPException(status_code=403, detail="User account is inactive")
    return current_user


async def get_optional_user(
    request: Request,
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Get user if authenticated, otherwise return None.
    Useful for endpoints that work for both authenticated and anonymous users.
    """
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None
        
        token = auth_header.replace("Bearer ", "")
        payload = clerk_auth.verify_token(token)
        user_id = payload.get("sub")
        
        if user_id:
            return db.query(User).filter(User.id == user_id).first()
        
        return None
    except:
        return None


class RoleChecker:
    """
    Dependency untuk check user role
    Usage: Depends(RoleChecker([UserRole.ADMIN]))
    """
    
    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = allowed_roles
    
    def __call__(self, current_user: User = Depends(get_current_active_user)) -> User:
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=403,
                detail=f"Access denied. Required roles: {[role.value for role in self.allowed_roles]}"
            )
        return current_user


class PermissionChecker:
    """
    Advanced permission checker dengan custom logic
    """
    
    def __init__(self, permission: str):
        self.permission = permission
    
    def __call__(self, current_user: User = Depends(get_current_active_user)) -> User:
        # Define permission mappings
        permissions_map = {
            "access_advanced_ai": lambda u: u.can_access_advanced_features,
            "verify_professionals": lambda u: u.is_admin,
            "manage_users": lambda u: u.is_admin,
            "access_analytics": lambda u: u.is_admin or u.is_professional,
            "unlimited_queries": lambda u: u.is_premium or u.is_admin,
        }
        
        check_func = permissions_map.get(self.permission)
        if not check_func:
            raise HTTPException(status_code=500, detail="Unknown permission")
        
        if not check_func(current_user):
            raise HTTPException(
                status_code=403,
                detail=f"Permission denied: {self.permission}"
            )
        
        return current_user


def require_subscription(tier: str = "premium"):
    """
    Decorator untuk require subscription tier tertentu
    """
    async def dependency(current_user: User = Depends(get_current_active_user)) -> User:
        from ..models.user import SubscriptionTier
        
        required_tiers = {
            "premium": [SubscriptionTier.PREMIUM, SubscriptionTier.ENTERPRISE],
            "enterprise": [SubscriptionTier.ENTERPRISE]
        }
        
        allowed_tiers = required_tiers.get(tier, [])
        
        if current_user.subscription_tier not in allowed_tiers and not current_user.is_admin:
            raise HTTPException(
                status_code=403,
                detail=f"This feature requires {tier} subscription"
            )
        
        return current_user
    
    return dependency


async def check_query_limit(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> User:
    """
    Check if user has remaining queries (for free tier)
    """
    FREE_TIER_MONTHLY_LIMIT = 10
    
    if not current_user.has_remaining_queries(FREE_TIER_MONTHLY_LIMIT):
        raise HTTPException(
            status_code=429,
            detail={
                "error": "Query limit reached",
                "message": f"You've reached your monthly limit of {FREE_TIER_MONTHLY_LIMIT} queries. Upgrade to Premium for unlimited queries.",
                "queries_used": current_user.ai_queries_this_month,
                "limit": FREE_TIER_MONTHLY_LIMIT
            }
        )
    
    return current_user


def log_action(action: str, resource_type: Optional[str] = None):
    """
    Decorator untuk log user actions ke audit log
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            from ..models.user import AuditLog
            from datetime import datetime
            
            # Get user from kwargs
            current_user = kwargs.get("current_user")
            db = kwargs.get("db")
            request = kwargs.get("request")
            
            try:
                result = await func(*args, **kwargs)
                
                # Log successful action
                if db and current_user:
                    audit_log = AuditLog(
                        user_id=current_user.id,
                        user_email=current_user.email,
                        user_role=current_user.role.value,
                        action=action,
                        resource_type=resource_type,
                        status="success",
                        ip_address=request.client.host if request else None,
                        created_at=datetime.utcnow()
                    )
                    db.add(audit_log)
                    db.commit()
                
                return result
                
            except Exception as e:
                # Log failed action
                if db and current_user:
                    audit_log = AuditLog(
                        user_id=current_user.id,
                        user_email=current_user.email,
                        user_role=current_user.role.value,
                        action=action,
                        resource_type=resource_type,
                        status="failure",
                        error_message=str(e),
                        ip_address=request.client.host if request else None,
                        created_at=datetime.utcnow()
                    )
                    db.add(audit_log)
                    db.commit()
                
                raise
        
        return wrapper
    return decorator


# Common role dependencies
require_admin = RoleChecker([UserRole.ADMIN])
require_professional = RoleChecker([UserRole.PROFESIONAL_HUKUM, UserRole.ADMIN])
require_any_authenticated = Depends(get_current_active_user)
