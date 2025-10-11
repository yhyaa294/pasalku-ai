from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import PyMongoError
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger(__name__)

class AnalyticsService:
    def __init__(self, mongo_client: AsyncIOMotorClient):
        self.mongo_client = mongo_client
        self.db: AsyncIOMotorDatabase = mongo_client.get_default_database()

    async def log_user_activity(self, user_id: str, activity_type: str, metadata: Dict[str, Any] = None):
        """Log user activity for analytics."""
        try:
            activity_doc = {
                "user_id": user_id,
                "activity_type": activity_type,
                "metadata": metadata or {},
                "timestamp": datetime.utcnow()
            }

            result = await self.db.user_activities.insert_one(activity_doc)
            logger.debug(f"Logged user activity: {result.inserted_id}")
            return result.inserted_id
        except PyMongoError as e:
            logger.error(f"Failed to log user activity: {str(e)}")
            return None

    async def log_consultation(self, session_id: str, query: str, response: str,
                               user_id: Optional[str] = None, metadata: Dict[str, Any] = None):
        """Log legal consultation for analytics."""
        try:
            consult_doc = {
                "session_id": session_id,
                "user_id": user_id,
                "query": query,
                "response": response,
                "query_length": len(query),
                "response_length": len(response),
                "metadata": metadata or {},
                "timestamp": datetime.utcnow()
            }

            result = await self.db.consultations.insert_one(consult_doc)
            logger.debug(f"Logged consultation: {result.inserted_id}")
            return result.inserted_id
        except PyMongoError as e:
            logger.error(f"Failed to log consultation: {str(e)}")
            return None

    async def get_user_analytics(self, user_id: str, days: int = 30) -> Dict[str, Any]:
        """Get analytics data for a specific user."""
        try:
            start_date = datetime.utcnow() - timedelta(days=days)

            # Consultation count
            consult_count = await self.db.consultations.count_documents({
                "user_id": user_id,
                "timestamp": {"$gte": start_date}
            })

            # Activity summary
            activities_pipeline = [
                {"$match": {
                    "user_id": user_id,
                    "timestamp": {"$gte": start_date}
                }},
                {"$group": {
                    "_id": "$activity_type",
                    "count": {"$sum": 1}
                }}
            ]
            activity_results = await self.db.user_activities.aggregate(activities_pipeline).to_list(length=None)

            # Total consultation time (estimated from response length)
            consult_pipeline = [
                {"$match": {
                    "user_id": user_id,
                    "timestamp": {"$gte": start_date}
                }},
                {"$group": {
                    "_id": None,
                    "total_response_length": {"$sum": "$response_length"},
                    "avg_query_length": {"$avg": "$query_length"},
                    "consultations": {"$sum": 1}
                }}
            ]
            consult_summary = await self.db.consultations.aggregate(consult_pipeline).to_list(length=1)

            activities_summary = {}
            for activity in activity_results:
                activities_summary[activity["_id"]] = activity["count"]

            summary = consult_summary[0] if consult_summary else {
                "total_response_length": 0,
                "avg_query_length": 0,
                "consultations": 0
            }

            return {
                "user_id": user_id,
                "period_days": days,
                "total_consultations": consult_count,
                "activities": activities_summary,
                "estimated_reading_time_minutes": summary.get("total_response_length", 0) / 200,  # Assuming 200 words per minute
                "avg_query_length": summary.get("avg_query_length", 0),
                "last_updated": datetime.utcnow()
            }

        except PyMongoError as e:
            logger.error(f"Failed to get user analytics: {str(e)}")
            return {}

    async def get_global_analytics(self, days: int = 30) -> Dict[str, Any]:
        """Get global platform analytics."""
        try:
            start_date = datetime.utcnow() - timedelta(days=days)

            # Total unique users
            unique_users = await self.db.user_activities.distinct(
                "user_id",
                {"timestamp": {"$gte": start_date}}
            )

            # Total consultations
            total_consultations = await self.db.consultations.count_documents({
                "timestamp": {"$gte": start_date}
            })

            # Activity breakdown
            activities_pipeline = [
                {"$match": {"timestamp": {"$gte": start_date}}},
                {"$group": {
                    "_id": "$activity_type",
                    "count": {"$sum": 1}
                }}
            ]
            activity_breakdown = await self.db.user_activities.aggregate(activities_pipeline).to_list(length=None)

            # Daily activity trend
            daily_pipeline = [
                {"$match": {"timestamp": {"$gte": start_date}}},
                {"$group": {
                    "_id": {
                        "year": {"$year": "$timestamp"},
                        "month": {"$month": "$timestamp"},
                        "day": {"$dayOfMonth": "$timestamp"}
                    },
                    "count": {"$sum": 1}
                }},
                {"$sort": {"_id": 1}}
            ]
            daily_trend = await self.db.user_activities.aggregate(daily_pipeline).to_list(length=None)

            activities_summary = {}
            for activity in activity_breakdown:
                activities_summary[activity["_id"]] = activity["count"]

            daily_data = []
            for day in daily_trend:
                daily_data.append({
                    "date": f"{day['_id']['year']}-{day['_id']['month']:02d}-{day['_id']['day']:02d}",
                    "activity_count": day["count"]
                })

            return {
                "period_days": days,
                "total_unique_users": len(unique_users),
                "total_consultations": total_consultations,
                "activity_breakdown": activities_summary,
                "daily_activity_trend": daily_data,
                "generated_at": datetime.utcnow()
            }

        except PyMongoError as e:
            logger.error(f"Failed to get global analytics: {str(e)}")
            return {}

    async def get_payment_analytics(self, days: int = 30) -> Dict[str, Any]:
        """Get payment analytics from MongoDB."""
        try:
            start_date = datetime.utcnow() - timedelta(days=days)

            # Revenue pipeline
            revenue_pipeline = [
                {"$match": {
                    "created_at": {"$gte": start_date},
                    "status": "succeeded"
                }},
                {"$group": {
                    "_id": "$payment_type",
                    "total_amount": {"$sum": "$amount"},
                    "count": {"$sum": 1}
                }}
            ]

            # Daily revenue trend
            daily_revenue_pipeline = [
                {"$match": {
                    "created_at": {"$gte": start_date},
                    "status": "succeeded"
                }},
                {"$group": {
                    "_id": {
                        "year": {"$year": "$created_at"},
                        "month": {"$month": "$created_at"},
                        "day": {"$dayOfMonth": "$created_at"}
                    },
                    "revenue": {"$sum": "$amount"},
                    "transaction_count": {"$sum": 1}
                }},
                {"$sort": {"_id": 1}}
            ]

            revenue_summary = await self.db.payments.aggregate(revenue_pipeline).to_list(length=None)
            daily_revenue = await self.db.payments.aggregate(daily_revenue_pipeline).to_list(length=None)

            revenue_by_type = {}
            total_revenue = 0

            for item in revenue_summary:
                revenue_by_type[item["_id"]] = {
                    "amount": item["total_amount"],
                    "count": item["count"]
                }
                total_revenue += item["total_amount"]

            daily_revenue_data = []
            for day in daily_revenue:
                daily_revenue_data.append({
                    "date": f"{day['_id']['year']}-{day['_id']['month']:02d}-{day['_id']['day']:02d}",
                    "revenue": day["revenue"],
                    "transactions": day["transaction_count"]
                })

            return {
                "period_days": days,
                "total_revenue_cents": total_revenue,
                "total_revenue_usd": total_revenue / 100,
                "revenue_by_type": revenue_by_type,
                "daily_revenue_trend": daily_revenue_data,
                "generated_at": datetime.utcnow()
            }

        except PyMongoError as e:
            logger.error(f"Failed to get payment analytics: {str(e)}")
            return {}