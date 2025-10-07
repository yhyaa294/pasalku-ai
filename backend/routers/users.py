"""
Router untuk manajemen pengguna
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend import crud
from backend import schemas
from backend import models
from backend.core.security import get_current_user, get_current_active_superuser
from backend.database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.User])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_active_superuser),
    db: Session = Depends(get_db)
):
    """
    Dapatkan daftar pengguna (hanya untuk admin)
    """
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=schemas.User)
async def read_user(
    user_id: int,
    current_user: models.User = Depends(get_current_active_superuser),
    db: Session = Depends(get_db)
):
    """
    Dapatkan detail pengguna berdasarkan ID (hanya untuk admin)
    """
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/me", response_model=schemas.User)
async def update_user_me(
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update informasi pengguna yang sedang login
    """
    user = crud.update_user(db, user_id=current_user.id, user_in=user_in)
    return user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    current_user: models.User = Depends(get_current_active_superuser),
    db: Session = Depends(get_db)
):
    """
    Hapus pengguna (hanya untuk admin)
    """
    if user_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="Tidak bisa menghapus akun sendiri"
        )
    
    user = crud.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    crud.delete_user(db, user_id=user_id)
    return {"message": "User berhasil dihapus"}
