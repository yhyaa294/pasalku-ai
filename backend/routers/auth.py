"""
Router untuk handle autentikasi pengguna
"""
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Any

from backend import crud
from backend import schemas
from backend import models
from backend.core.security import create_access_token, get_current_user, verify_password
from backend.core.config import settings
from backend.database import get_db

# Setup logging
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/login", response_model=schemas.Token)
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
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            subject=user.email, expires_delta=access_token_expires
        )
        
        logger.info(f"Access token created successfully for: {user.email}")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "email": user.email,
                "role": user.role.value if hasattr(user.role, 'value') else str(user.role)
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
