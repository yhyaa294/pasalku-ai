"""
Authentication Router dengan Clerk Integration
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import logging

from ..database import get_db
from ..models.user import User, UserRole, SubscriptionTier, VerificationStatus
from ..middleware.auth import (
    get_current_user,
    get_current_active_user,
    require_admin,
    log_action
)

logger = logging.getLogger(__name__)

router = APIRouter()


# Pydantic models
class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str]
    role: str
    subscription_tier: str
    is_active: bool
    is_email_verified: bool
    created_at: datetime
    last_login_at: Optional[datetime]
    
    # Professional info (if applicable)
    is_professional: bool
    verification_status: Optional[str]
    professional_license_number: Optional[str]
    professional_organization: Optional[str]
    
    # Usage stats
    ai_queries_count: int
    ai_queries_this_month: int
    
    class Config:
        from_attributes = True


class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    preferences: Optional[dict] = None


class SyncUserRequest(BaseModel):
    """Request untuk sync user data dari Clerk"""
    clerk_user_id: str
    email: EmailStr
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    email_verified: bool = False


@router.get("/me", response_model=UserResponse, tags=["Authentication"])
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current authenticated user information
    """
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role.value,
        subscription_tier=current_user.subscription_tier.value,
        is_active=current_user.is_active,
        is_email_verified=current_user.is_email_verified,
        created_at=current_user.created_at,
        last_login_at=current_user.last_login_at,
        is_professional=current_user.is_professional,
        verification_status=current_user.verification_status.value if current_user.verification_status else None,
        professional_license_number=current_user.professional_license_number,
        professional_organization=current_user.professional_organization,
        ai_queries_count=current_user.ai_queries_count,
        ai_queries_this_month=current_user.ai_queries_this_month
    )


@router.put("/me", response_model=UserResponse, tags=["Authentication"])
@log_action("user.update", "user")
async def update_current_user(
    update_data: UserUpdateRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    request: Request = None
):
    """
    Update current user information
    """
    # Update allowed fields
    if update_data.full_name is not None:
        current_user.full_name = update_data.full_name
    
    if update_data.phone_number is not None:
        current_user.phone_number = update_data.phone_number
    
    if update_data.preferences is not None:
        current_user.preferences = update_data.preferences
    
    current_user.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(current_user)
    
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role.value,
        subscription_tier=current_user.subscription_tier.value,
        is_active=current_user.is_active,
        is_email_verified=current_user.is_email_verified,
        created_at=current_user.created_at,
        last_login_at=current_user.last_login_at,
        is_professional=current_user.is_professional,
        verification_status=current_user.verification_status.value if current_user.verification_status else None,
        professional_license_number=current_user.professional_license_number,
        professional_organization=current_user.professional_organization,
        ai_queries_count=current_user.ai_queries_count,
        ai_queries_this_month=current_user.ai_queries_this_month
    )


@router.post("/sync", tags=["Authentication"])
async def sync_user_from_clerk(
    sync_data: SyncUserRequest,
    db: Session = Depends(get_db)
):
    """
    Sync user data from Clerk webhook.
    Called by Clerk when user is created/updated.
    """
    # Check if user exists
    user = db.query(User).filter(User.id == sync_data.clerk_user_id).first()
    
    if user:
        # Update existing user
        user.email = sync_data.email
        user.full_name = sync_data.full_name
        user.phone_number = sync_data.phone_number
        user.is_email_verified = sync_data.email_verified
        user.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(user)
        
        logger.info(f"User synced from Clerk: {user.id}")
        return {"status": "updated", "user_id": user.id}
    else:
        # Create new user
        new_user = User(
            id=sync_data.clerk_user_id,
            email=sync_data.email,
            full_name=sync_data.full_name,
            phone_number=sync_data.phone_number,
            role=UserRole.MASYARAKAT_UMUM,
            subscription_tier=SubscriptionTier.FREE,
            is_email_verified=sync_data.email_verified,
            verification_status=VerificationStatus.NOT_REQUESTED
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        logger.info(f"New user created from Clerk: {new_user.id}")
        return {"status": "created", "user_id": new_user.id}


@router.delete("/me", tags=["Authentication"])
@log_action("user.delete", "user")
async def delete_current_user(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    request: Request = None
):
    """
    Soft delete current user account.
    Note: Actual deletion should be handled by Clerk.
    This just marks the user as inactive in our database.
    """
    current_user.is_active = False
    current_user.updated_at = datetime.utcnow()
    
    db.commit()
    
    logger.info(f"User account deactivated: {current_user.id}")
    
    return {
        "status": "success",
        "message": "Account deactivated successfully"
    }


@router.get("/usage", tags=["Authentication"])
async def get_usage_stats(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user's usage statistics
    """
    FREE_TIER_LIMIT = 10
    
    return {
        "subscription_tier": current_user.subscription_tier.value,
        "queries": {
            "total": current_user.ai_queries_count,
            "this_month": current_user.ai_queries_this_month,
            "limit": None if current_user.is_premium else FREE_TIER_LIMIT,
            "remaining": None if current_user.is_premium else max(0, FREE_TIER_LIMIT - current_user.ai_queries_this_month)
        },
        "documents_uploaded": current_user.documents_uploaded_count,
        "last_query_at": current_user.last_query_at,
        "features": {
            "unlimited_queries": current_user.is_premium,
            "advanced_ai": current_user.can_access_advanced_features,
            "dual_ai_verification": current_user.is_premium,
            "document_analysis": True,
            "knowledge_graph": current_user.can_access_advanced_features
        }
    }


# Admin endpoints
@router.get("/users", tags=["Admin"])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    role: Optional[str] = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    List all users (Admin only)
    """
    query = db.query(User)
    
    if role:
        try:
            role_enum = UserRole(role)
            query = query.filter(User.role == role_enum)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid role")
    
    users = query.offset(skip).limit(limit).all()
    
    return {
        "total": query.count(),
        "users": [
            UserResponse(
                id=user.id,
                email=user.email,
                full_name=user.full_name,
                role=user.role.value,
                subscription_tier=user.subscription_tier.value,
                is_active=user.is_active,
                is_email_verified=user.is_email_verified,
                created_at=user.created_at,
                last_login_at=user.last_login_at,
                is_professional=user.is_professional,
                verification_status=user.verification_status.value if user.verification_status else None,
                professional_license_number=user.professional_license_number,
                professional_organization=user.professional_organization,
                ai_queries_count=user.ai_queries_count,
                ai_queries_this_month=user.ai_queries_this_month
            )
            for user in users
        ]
    }


@router.put("/users/{user_id}/role", tags=["Admin"])
@log_action("user.role_changed", "user")
async def update_user_role(
    user_id: str,
    new_role: str,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
    request: Request = None
):
    """
    Update user role (Admin only)
    """
    # Validate role
    try:
        role_enum = UserRole(new_role)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    # Get target user
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update role
    old_role = target_user.role
    target_user.role = role_enum
    target_user.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(target_user)
    
    logger.info(f"User role updated: {user_id} from {old_role} to {new_role} by {current_user.id}")
    
    return {
        "status": "success",
        "user_id": user_id,
        "old_role": old_role.value,
        "new_role": new_role
    }


@router.put("/users/{user_id}/status", tags=["Admin"])
@log_action("user.status_changed", "user")
async def update_user_status(
    user_id: str,
    is_active: bool,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
    request: Request = None
):
    """
    Activate/deactivate user (Admin only)
    """
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    target_user.is_active = is_active
    target_user.updated_at = datetime.utcnow()
    
    db.commit()
    
    logger.info(f"User status updated: {user_id} active={is_active} by {current_user.id}")
    
    return {
        "status": "success",
        "user_id": user_id,
        "is_active": is_active
    }
