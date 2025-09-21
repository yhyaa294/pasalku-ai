from pydantic import BaseModel, EmailStr
from models import UserRole

# Shared properties
class UserBase(BaseModel):
    email: EmailStr

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str

# Properties to return to client
class User(UserBase):
    id: int
    role: UserRole

    class Config:
        from_attributes = True # formerly orm_mode

# Properties to receive via API on update
class UserUpdate(BaseModel):
    email: EmailStr | None = None
    password: str | None = None

# Properties for token
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

# Schemas for AI Chat
class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    answer: str
    citations: list[str]
    disclaimer: str

class ChatHistory(BaseModel):
    id: int
    user_id: int
    query: str
    response: str
    timestamp: str
    
    class Config:
        from_attributes = True
