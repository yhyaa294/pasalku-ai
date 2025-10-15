from fastapi import APIRouter, HTTPException, Depends, Query
from motor.motor_asyncio import AsyncIOMotorClient
from backend.services.analytics_service import AnalyticsService
from backend.services.analytics_tracker import get_tracker
from backend.core.config import get_settings
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
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


# Request/Response Models

class TrackEventRequest(BaseModel):
    """Request to track an event"""
    event_type: str = Field(..., description="Type of event")
    user_id: Optional[str] = Field(None, description="User ID (optional)")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Event metadata")


class EventResponse(BaseModel):
    """Event response"""
    event_id: str
    event_type: str
    timestamp: str
    user_id: str
    metadata: Dict[str, Any]


class MetricsSummaryResponse(BaseModel):
    """Summary of all metrics"""
    total_queries: int
    total_citations: int
    total_predictions: int
    total_documents: int
    total_translations: int
    total_exports: int
    average_response_time_ms: float
    success_rate: float
    period_days: int


class PopularTopicResponse(BaseModel):
    """Popular topic with count"""
    topic: str
    count: int


class LanguageDistributionResponse(BaseModel):
    """Language usage distribution"""
    language: str
    count: int
    percentage: float


class PredictionStatsResponse(BaseModel):
    """Prediction statistics"""
    total_predictions: int
    average_confidence: float
    high_confidence_count: int
    medium_confidence_count: int
    low_confidence_count: int
    high_confidence_percentage: float
    medium_confidence_percentage: float
    low_confidence_percentage: float


class CitationStatsResponse(BaseModel):
    """Citation statistics"""
    total_citations: int
    valid_citations: int
    invalid_citations: int
    validation_rate: float
    most_cited_laws: List[Dict[str, Any]]


class TimelineDataPoint(BaseModel):
    """Timeline data point"""
    timestamp: str
    total: int
    chat_query: int = 0
    citation_detected: int = 0
    prediction_requested: int = 0
    document_generated: int = 0
    translation_performed: int = 0
    export_performed: int = 0

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


# ===== NEW ADVANCED ANALYTICS ENDPOINTS =====

@router.post("/track", response_model=EventResponse)
async def track_event(request: TrackEventRequest):
    """Track an analytics event"""
    tracker = get_tracker()
    
    event = tracker.track_event(
        event_type=request.event_type,
        user_id=request.user_id,
        metadata=request.metadata
    )
    
    return EventResponse(**event)


@router.get("/summary", response_model=MetricsSummaryResponse)
async def get_metrics_summary(
    days: int = Query(30, description="Number of days to analyze", ge=1, le=365)
):
    """Get summary of all metrics"""
    tracker = get_tracker()
    start_date = datetime.utcnow() - timedelta(days=days)
    
    event_counts = tracker.get_event_counts(start_date=start_date)
    response_time = tracker.get_average_response_time(days=days)
    success_rate_data = tracker.get_success_rate("chat_query", days=days)
    
    return MetricsSummaryResponse(
        total_queries=event_counts.get("chat_query", 0),
        total_citations=event_counts.get("citation_detected", 0),
        total_predictions=event_counts.get("prediction_requested", 0),
        total_documents=event_counts.get("document_generated", 0),
        total_translations=event_counts.get("translation_performed", 0),
        total_exports=event_counts.get("export_performed", 0),
        average_response_time_ms=response_time.get("average_ms", 0.0),
        success_rate=success_rate_data.get("success_rate", 0.0),
        period_days=days
    )


@router.get("/popular-topics", response_model=List[PopularTopicResponse])
async def get_popular_topics(
    limit: int = Query(10, description="Number of topics", ge=1, le=50),
    days: int = Query(30, description="Number of days", ge=1, le=365)
):
    """Get most popular query topics"""
    tracker = get_tracker()
    topics = tracker.get_popular_topics(limit=limit, days=days)
    
    return [PopularTopicResponse(**topic) for topic in topics]


@router.get("/language-distribution", response_model=List[LanguageDistributionResponse])
async def get_language_distribution(
    days: int = Query(30, description="Number of days", ge=1, le=365)
):
    """Get distribution of languages used"""
    tracker = get_tracker()
    distribution = tracker.get_language_distribution(days=days)
    
    total = sum(distribution.values())
    if total == 0:
        return []
    
    result = [
        LanguageDistributionResponse(
            language=lang,
            count=count,
            percentage=(count / total) * 100
        )
        for lang, count in distribution.items()
    ]
    
    result.sort(key=lambda x: x.count, reverse=True)
    return result


@router.get("/prediction-stats", response_model=PredictionStatsResponse)
async def get_prediction_stats(
    days: int = Query(30, description="Number of days", ge=1, le=365)
):
    """Get prediction statistics"""
    tracker = get_tracker()
    stats = tracker.get_prediction_accuracy(days=days)
    
    return PredictionStatsResponse(**stats)


@router.get("/citation-stats", response_model=CitationStatsResponse)
async def get_citation_stats(
    days: int = Query(30, description="Number of days", ge=1, le=365)
):
    """Get citation detection statistics"""
    tracker = get_tracker()
    stats = tracker.get_citation_statistics(days=days)
    
    return CitationStatsResponse(**stats)


@router.get("/document-types", response_model=Dict[str, int])
async def get_document_type_distribution(
    days: int = Query(30, description="Number of days", ge=1, le=365)
):
    """Get distribution of document types"""
    tracker = get_tracker()
    return tracker.get_document_type_distribution(days=days)


@router.get("/timeline", response_model=List[TimelineDataPoint])
async def get_usage_timeline(
    days: int = Query(30, description="Number of days", ge=1, le=365),
    granularity: str = Query("day", description="Granularity: day or hour")
):
    """Get usage timeline"""
    if granularity not in ["day", "hour"]:
        raise HTTPException(status_code=400, detail="Granularity must be 'day' or 'hour'")
    
    tracker = get_tracker()
    timeline = tracker.get_usage_timeline(days=days, granularity=granularity)
    
    return [TimelineDataPoint(**point) for point in timeline]


@router.get("/response-time")
async def get_response_time_stats(
    days: int = Query(30, description="Number of days", ge=1, le=365)
):
    """Get response time statistics"""
    tracker = get_tracker()
    return tracker.get_average_response_time(days=days)


@router.get("/success-rate")
async def get_success_rate_stats(
    event_type: str = Query("chat_query", description="Event type"),
    days: int = Query(30, description="Number of days", ge=1, le=365)
):
    """Get success rate for event type"""
    tracker = get_tracker()
    return tracker.get_success_rate(event_type, days=days)


@router.get("/events", response_model=List[EventResponse])
async def get_events_list(
    event_type: Optional[str] = Query(None, description="Filter by event type"),
    user_id: Optional[str] = Query(None, description="Filter by user ID"),
    limit: int = Query(100, description="Number of events", ge=1, le=1000)
):
    """Get recent events"""
    tracker = get_tracker()
    
    events = tracker.get_events(
        event_type=event_type,
        user_id=user_id,
        limit=limit
    )
    
    return [EventResponse(**event) for event in events]


@router.get("/dashboard-data")
async def get_comprehensive_dashboard_data(
    days: int = Query(30, description="Number of days", ge=1, le=365)
):
    """Get comprehensive dashboard data in single request"""
    tracker = get_tracker()
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Get all data
    event_counts = tracker.get_event_counts(start_date=start_date)
    response_time = tracker.get_average_response_time(days=days)
    success_rate_data = tracker.get_success_rate("chat_query", days=days)
    popular_topics = tracker.get_popular_topics(limit=10, days=days)
    language_dist = tracker.get_language_distribution(days=days)
    prediction_stats = tracker.get_prediction_accuracy(days=days)
    citation_stats = tracker.get_citation_statistics(days=days)
    document_types = tracker.get_document_type_distribution(days=days)
    timeline = tracker.get_usage_timeline(days=days, granularity="day")
    
    # Calculate language percentages
    total_langs = sum(language_dist.values())
    language_dist_with_pct = [
        {
            "language": lang,
            "count": count,
            "percentage": (count / total_langs * 100) if total_langs > 0 else 0
        }
        for lang, count in language_dist.items()
    ]
    
    return {
        "summary": {
            "total_queries": event_counts.get("chat_query", 0),
            "total_citations": event_counts.get("citation_detected", 0),
            "total_predictions": event_counts.get("prediction_requested", 0),
            "total_documents": event_counts.get("document_generated", 0),
            "total_translations": event_counts.get("translation_performed", 0),
            "total_exports": event_counts.get("export_performed", 0),
            "average_response_time_ms": response_time.get("average_ms", 0.0),
            "success_rate": success_rate_data.get("success_rate", 0.0),
            "period_days": days
        },
        "popular_topics": popular_topics,
        "language_distribution": language_dist_with_pct,
        "prediction_stats": prediction_stats,
        "citation_stats": citation_stats,
        "document_types": document_types,
        "timeline": timeline,
        "generated_at": datetime.utcnow().isoformat()
    }