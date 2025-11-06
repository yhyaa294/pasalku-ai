"""
Conversation Storage Service - MongoDB Integration
Save and retrieve orchestrator conversations
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
import motor.motor_asyncio
from models.orchestrator_conversation import (
    ConversationSession,
    ConversationMessage,
    ConversationSummary,
    COLLECTION_NAME
)
from core.config import get_settings

settings = get_settings()


class ConversationStorage:
    """Service for managing conversation persistence"""
    
    def __init__(self):
        self.client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
        self.db = None
        self.collection = None
        self.initialized = False
    
    async def initialize(self):
        """Initialize MongoDB connection"""
        if not settings.MONGODB_URI:
            print("⚠️  MongoDB URI not configured - conversations won't be saved")
            return False
        
        try:
            self.client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
            self.db = self.client.get_default_database()
            self.collection = self.db[COLLECTION_NAME]
            
            # Create indexes
            await self.collection.create_index("session_id", unique=True)
            await self.collection.create_index("user_id")
            await self.collection.create_index("created_at")
            await self.collection.create_index("last_activity")
            await self.collection.create_index([("user_id", 1), ("created_at", -1)])
            
            self.initialized = True
            print("✅ Conversation storage initialized")
            return True
            
        except Exception as e:
            print(f"⚠️  Failed to initialize conversation storage: {e}")
            return False
    
    async def save_conversation(
        self,
        session: ConversationSession
    ) -> bool:
        """Save or update conversation session"""
        if not self.initialized:
            return False
        
        try:
            session.updated_at = datetime.utcnow()
            session.last_activity = datetime.utcnow()
            
            # Convert to dict
            session_dict = session.dict()
            
            # Upsert
            await self.collection.update_one(
                {"session_id": session.session_id},
                {"$set": session_dict},
                upsert=True
            )
            
            return True
            
        except Exception as e:
            print(f"Error saving conversation: {e}")
            return False
    
    async def get_conversation(
        self,
        session_id: str
    ) -> Optional[ConversationSession]:
        """Retrieve conversation by session ID"""
        if not self.initialized:
            return None
        
        try:
            doc = await self.collection.find_one({"session_id": session_id})
            if doc:
                doc.pop('_id', None)  # Remove MongoDB _id
                return ConversationSession(**doc)
            return None
            
        except Exception as e:
            print(f"Error retrieving conversation: {e}")
            return None
    
    async def get_user_conversations(
        self,
        user_id: str,
        limit: int = 20,
        skip: int = 0
    ) -> List[ConversationSummary]:
        """Get all conversations for a user"""
        if not self.initialized:
            return []
        
        try:
            cursor = self.collection.find(
                {"user_id": user_id}
            ).sort("last_activity", -1).skip(skip).limit(limit)
            
            summaries = []
            async for doc in cursor:
                # Create summary
                first_user_msg = None
                for msg in doc.get("messages", []):
                    if msg.get("role") == "user":
                        first_user_msg = msg.get("content", "")[:100]
                        break
                
                summary = ConversationSummary(
                    session_id=doc["session_id"],
                    user_id=doc.get("user_id"),
                    legal_area=doc.get("legal_area", "general"),
                    current_stage=doc.get("current_stage", 1),
                    message_count=len(doc.get("messages", [])),
                    created_at=doc.get("created_at"),
                    last_activity=doc.get("last_activity"),
                    status=doc.get("status", "active"),
                    first_message_preview=first_user_msg
                )
                summaries.append(summary)
            
            return summaries
            
        except Exception as e:
            print(f"Error getting user conversations: {e}")
            return []
    
    async def add_message(
        self,
        session_id: str,
        role: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Add a message to existing conversation"""
        if not self.initialized:
            return False
        
        try:
            message = ConversationMessage(
                role=role,
                content=content,
                timestamp=datetime.utcnow(),
                metadata=metadata
            )
            
            await self.collection.update_one(
                {"session_id": session_id},
                {
                    "$push": {"messages": message.dict()},
                    "$set": {
                        "updated_at": datetime.utcnow(),
                        "last_activity": datetime.utcnow()
                    }
                }
            )
            
            return True
            
        except Exception as e:
            print(f"Error adding message: {e}")
            return False
    
    async def update_context(
        self,
        session_id: str,
        legal_area: Optional[str] = None,
        current_stage: Optional[int] = None,
        detected_signals: Optional[Dict[str, Any]] = None,
        suggested_features: Optional[List[Dict[str, Any]]] = None
    ) -> bool:
        """Update conversation context"""
        if not self.initialized:
            return False
        
        try:
            update_fields = {
                "updated_at": datetime.utcnow(),
                "last_activity": datetime.utcnow()
            }
            
            if legal_area:
                update_fields["legal_area"] = legal_area
            if current_stage:
                update_fields["current_stage"] = current_stage
            if detected_signals:
                update_fields["detected_signals"] = detected_signals
            if suggested_features:
                update_fields["suggested_features"] = suggested_features
            
            await self.collection.update_one(
                {"session_id": session_id},
                {"$set": update_fields}
            )
            
            return True
            
        except Exception as e:
            print(f"Error updating context: {e}")
            return False
    
    async def mark_feature_used(
        self,
        session_id: str,
        feature_id: str
    ) -> bool:
        """Track feature usage"""
        if not self.initialized:
            return False
        
        try:
            await self.collection.update_one(
                {"session_id": session_id},
                {
                    "$addToSet": {"features_used": feature_id},
                    "$set": {"last_activity": datetime.utcnow()}
                }
            )
            return True
            
        except Exception as e:
            print(f"Error marking feature used: {e}")
            return False
    
    async def complete_conversation(
        self,
        session_id: str,
        analysis_results: Optional[Dict[str, Any]] = None,
        report_generated: bool = False
    ) -> bool:
        """Mark conversation as completed"""
        if not self.initialized:
            return False
        
        try:
            update_fields = {
                "status": "completed",
                "updated_at": datetime.utcnow()
            }
            
            if analysis_results:
                update_fields["analysis_results"] = analysis_results
            if report_generated:
                update_fields["report_generated"] = report_generated
            
            await self.collection.update_one(
                {"session_id": session_id},
                {"$set": update_fields}
            )
            
            return True
            
        except Exception as e:
            print(f"Error completing conversation: {e}")
            return False


# Global instance
conversation_storage = ConversationStorage()
