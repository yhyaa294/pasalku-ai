from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from backend.services.analytics_service import AnalyticsService
from backend.core.config import get_settings
from typing import Optional
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

settings = get_settings()

# Dependency to get MongoDB client
async def get_mongo_client():
    """Get MongoDB client from server.py global variable."""
    # Import here to avoid circular imports
    import motor.motor_asyncio
    try:
        mongo_client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
        return mongo_client
    except Exception as e:
        logger.error(f"MongoDB connection failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Analytics service unavailable")

async def get_analytics_service(mongo_client: AsyncIOMotorClient = Depends(get_mongo_client)):
    """Get analytics service instance."""
    return AnalyticsService(mongo_client)

router = APIRouter()

@router.get("/user/{user_id}")
async def get_user_analytics(user_id: str, days: int = 30,
                           analytics_service: AnalyticsService = Depends(get_analytics_service)):
    """Get analytics data for a specific user."""
    try:
        analytics = await analytics_service.get_user_analytics(user_id, days)
        return analytics
    except Exception as e:
        logger.error(f"Failed to get user analytics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve user analytics")

@router.get("/global")
async def get_global_analytics(days: int = 30,
                              analytics_service: AnalyticsService = Depends(get_analytics_service)):
    """Get global platform analytics."""
    try:
        analytics = await analytics_service.get_global_analytics(days)
        return analytics
    except Exception as e:
        logger.error(f"Failed to get global analytics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve global analytics")

@router.get("/payments")
async def get_payment_analytics(days: int = 30):
    """Get payment analytics (using existing payment data from PostgreSQL)."""
    # This will be implemented using the existing payments table
    # For now, return empty structure
    try:
        # In a real implementation, this would integrate with payment analytics
        # from both MongoDB logs and PostgreSQL payment records
        return {
            "period_days": days,
            "note": "Payment analytics integration in progress",
            "total_revenue_usd": 0,
            "total_subscriptions": 0,
            "daily_revenue_trend": [],
            "generated_at": "2025-01-01T00:00:00"
        }
    except Exception as e:
        logger.error(f"Failed to get payment analytics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve payment analytics")

@router.get("/dashboard-overview")
async def get_dashboard_overview(days: int = 30,
                               analytics_service: AnalyticsService = Depends(get_analytics_service)):
    """Get comprehensive dashboard overview combining multiple analytics."""
    try:
        global_analytics = await analytics_service.get_global_analytics(days)

        # Mock payment data for now (integrate with real payment analytics later)
        payment_data = {
            "total_revenue_usd": 0,
            "total_subscriptions": 0,
            "recent_transactions": []
        }

        dashboard_data = {
            "global_analytics": global_analytics,
            "payment_analytics": payment_data,
            "system_health": {
                "database_connected": True,
                "ai_services_available": True,
                "last_updated": "2025-01-01T00:00:00"
            }
        }

        return dashboard_data

    except Exception as e:
        logger.error(f"Failed to get dashboard overview: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve dashboard overview")

# Activity logging endpoint
@router.post("/log-activity")
async def log_user_activity(user_id: str, activity_type: str, metadata: Optional[dict] = None,
                           analytics_service: AnalyticsService = Depends(get_analytics_service)):
    """Log user activity for analytics."""
    try:
        activity_id = await analytics_service.log_user_activity(user_id, activity_type, metadata)
        if activity_id:
            return {"status": "logged", "activity_id": str(activity_id)}
        else:
            raise HTTPException(status_code=500, detail="Failed to log activity")
    except Exception as e:
        logger.error(f"Failed to log user activity: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to log activity")