"""
Router untuk handle autentikasi pengguna - Updated Version
"""
import logging
import json
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Any, Optional

from backend import crud
from backend import schemas
from backend import models
from backend.core.security_updated import (
    create_access_token,
    create_refresh_token,
    get_current_user,
    verify_password,
    verify_token
)
from backend.core.clerk_service import (
    clerk_service,
    get_clerk_user
)
from fastapi import Request, Form
from backend.core.config import settings
from backend.database import get_db

# Setup logging
logger = logging.getLogger(__name__)

router = APIRouter()

# Clerk authentication dependency
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_clerk_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[dict]:
    """Dependency for Clerk authenticated users"""
    user_data = await get_clerk_user(token, db)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate Clerk credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user_data

@router.post("/login", response_model=schemas.TokenPair)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    logger.info(f"Login attempt for email: {form_data.username}")

    try:
        # Check if user exists
        user = crud.get_user_by_email(db, email=form_data.username)
        if not user:
            logger.warning(f"User not found: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        logger.info(f"User found: {user.email}, Role: {user.role}")

        # Verify password
        if not verify_password(form_data.password, user.hashed_password):
            logger.warning(f"Invalid password for user: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        logger.info(f"Password verified successfully for: {user.email}")

        # Create access and refresh tokens
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            subject=user.email, expires_delta=access_token_expires
        )
        refresh_token = create_refresh_token(subject=user.email)

        logger.info(f"Tokens created successfully for: {user.email}")

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role.value if hasattr(user.role, 'value') else str(user.role),
                "is_active": bool(user.is_active)
            }
        }

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}")
        logger.error(f"Error type: {type(e).__name__}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/refresh-token", response_model=schemas.TokenPair)
async def refresh_access_token(
    refresh_token_data: schemas.RefreshToken,
    db: Session = Depends(get_db)
):
    """
    Refresh access token using refresh token
    """
    try:
        # Verify refresh token
        email = verify_token(refresh_token_data.refresh_token, "refresh")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )

        # Get user
        user = crud.get_user_by_email(db, email=email)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )

        # Create new tokens
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            subject=user.email, expires_delta=access_token_expires
        )
        refresh_token = create_refresh_token(subject=user.email)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role.value if hasattr(user.role, 'value') else str(user.role),
                "is_active": bool(user.is_active)
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error refreshing token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/logout")
async def logout():
    """
    Logout endpoint (client should discard tokens)
    """
    # In a stateless JWT system, logout is handled client-side
    # In production, you might want to implement token blacklisting
    return {"message": "Successfully logged out"}

@router.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    """
    Create new user without the need to be logged in
    """
    db_user = crud.get_user_by_email(db, email=user_in.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user = crud.create_user(db=db, user=user_in)
    return user

@router.get("/me", response_model=schemas.User)
async def read_users_me(
    current_user: models.User = Depends(get_current_user)
):
    """
    Get current user information
    """
    return current_user

@router.put("/me", response_model=schemas.User)
async def update_user_me(
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user information
    """
    user = crud.update_user(db=db, user_id=current_user.id, user_in=user_in)
    return user

# ===== CLERK AUTHENTICATION ENDPOINTS =====

@router.post("/clerk-webhook", tags=["Clerk"])
async def clerk_webhook(request: Request):
    """
    Handle Clerk webhooks for user events (registration, profile updates, etc.)
    """
    try:
        body = await request.body()
        webhook_data = json.loads(body)

        event_type = webhook_data.get("type", "unknown")
        logger.info(f"Received Clerk webhook: {event_type}")

        # In production, verify webhook signature and handle different event types
        # For now, just acknowledge receipt
        return {"status": "ok", "event": event_type}

    except Exception as e:
        logger.error(f"Clerk webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail="Webhook processing failed")

@router.post("/clerk-login", response_model=schemas.Token, tags=["Clerk Authentication"])
async def clerk_login(
    clerk_jwt_token: str = Form(..., description="Clerk JWT token from frontend"),
    db: Session = Depends(get_db)
):
    """
    Authenticate user with Clerk JWT token and create local session
    """
    try:
        # Verify Clerk token
        token_data = clerk_service.verify_token(clerk_jwt_token)
        if not token_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Clerk token"
            )

        clerk_user_id = token_data.get("sub")
        if not clerk_user_id:
            raise HTTPException(status_code=400, detail="Invalid token payload")

        # Sync user data to local database
        synced_user = await clerk_service.sync_user_to_database(clerk_user_id, db)
        if not synced_user:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to sync user data"
            )

        # Create local JWT token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            subject=synced_user['email'],
            expires_delta=access_token_expires
        )

        logger.info(f"Successful Clerk login for: {synced_user['email']}")
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Clerk login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Clerk authentication failed"
        )

@router.get("/clerk-user", tags=["Clerk Authentication"])
async def get_clerk_user_profile(
    current_clerk_user = Depends(get_current_clerk_user)
):
    """
    Get Clerk user profile information (for enhanced authentication flows)
    """
    return current_clerk_user
