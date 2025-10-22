from fastapi import APIRouter, HTTPException, Depends
from typing import List
from backend.models.chat import Chat
from backend.database import get_db

chat_router = APIRouter()

@chat_router.post("/messages", response_model=Chat)
async def send_message(chat: Chat, db=Depends(get_db)):
    """
    Send a chat message.
    """
    try:
        # Logic to save the chat message to the database
        db.add(chat)
        await db.commit()
        await db.refresh(chat)
        return chat
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to send message")

@chat_router.get("/messages", response_model=List[Chat])
async def get_messages(db=Depends(get_db)):
    """
    Retrieve all chat messages.
    """
    try:
        messages = await db.query(Chat).all()
        return messages
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to retrieve messages")