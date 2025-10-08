from pydantic import BaseModel, EmailStr
from backend.models import UserRole
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str

# Properties to return to client
class User(UserBase):
    id: UUID
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Properties to receive via API on update
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None

# Properties for token
class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class RefreshToken(BaseModel):
    refresh_token: str

class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: dict

class TokenData(BaseModel):
    email: Optional[str] = None

# Schemas for AI Chat
class ChatRequest(BaseModel):
    query: str
    session_id: Optional[UUID] = None

class ChatResponse(BaseModel):
    session_id: UUID
    message: str
    citations: List[str]
    disclaimer: str

class ChatSessionBase(BaseModel):
    title: Optional[str] = None
    status: str = "active"

class ChatSessionCreate(ChatSessionBase):
    pass

class ChatSession(ChatSessionBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ChatMessageBase(BaseModel):
    role: str
    content: str
    citations: Optional[List[str]] = None

class ChatMessage(ChatMessageBase):
    id: UUID
    session_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class ChatHistory(BaseModel):
    session_id: UUID
    messages: List[ChatMessage]
    session: ChatSession

    class Config:
        from_attributes = True

# API Response formats
class APIResponse(BaseModel):
    status: str
    data: Optional[dict] = None
    message: Optional[str] = None

class APIError(BaseModel):
    status: str = "error"
    error: dict
