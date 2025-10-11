from typing import Dict, Any, Optional
import inngest
import json
import logging
from datetime import datetime, timedelta
from ..core.config import settings

logger = logging.getLogger(__name__)

class BackgroundTaskService:
    def __init__(self):
        self.client = inngest.Inngest(
            name="pasalku-ai",
            signing_key=settings.INNGEST_SIGNING_KEY,
            event_key=settings.INNGEST_EVENT_KEY
        )

    async def schedule_consultation_summary(
        self,
        session_id: str,
        user_id: str,
        delay_minutes: int = 5
    ) -> None:
        """Schedule a delayed consultation summary generation"""
        try:
            await self.client.send({
                "name": "consultation.summary.generate",
                "data": {
                    "session_id": session_id,
                    "user_id": user_id
                },
                "delay": delay_minutes * 60  # Convert to seconds
            })
        except Exception as e:
            logger.error(f"Error scheduling consultation summary: {str(e)}")
            raise

    async def schedule_subscription_reminder(
        self,
        user_id: str,
        subscription_id: str,
        expiry_date: datetime,
        days_before: int = 3
    ) -> None:
        """Schedule a subscription expiry reminder"""
        try:
            reminder_date = expiry_date - timedelta(days=days_before)
            
            await self.client.send({
                "name": "subscription.reminder",
                "data": {
                    "user_id": user_id,
                    "subscription_id": subscription_id,
                    "expiry_date": expiry_date.isoformat(),
                    "days_remaining": days_before
                },
                "delay": (reminder_date - datetime.now()).total_seconds()
            })
        except Exception as e:
            logger.error(f"Error scheduling subscription reminder: {str(e)}")
            raise

    async def schedule_consultation_followup(
        self,
        session_id: str,
        user_id: str,
        delay_days: int = 7
    ) -> None:
        """Schedule a consultation follow-up"""
        try:
            await self.client.send({
                "name": "consultation.followup",
                "data": {
                    "session_id": session_id,
                    "user_id": user_id
                },
                "delay": delay_days * 24 * 60 * 60  # Convert to seconds
            })
        except Exception as e:
            logger.error(f"Error scheduling consultation follow-up: {str(e)}")
            raise

    async def schedule_document_analysis(
        self,
        document_id: str,
        user_id: str
    ) -> None:
        """Schedule an asynchronous document analysis"""
        try:
            await self.client.send({
                "name": "document.analysis",
                "data": {
                    "document_id": document_id,
                    "user_id": user_id
                }
            })
        except Exception as e:
            logger.error(f"Error scheduling document analysis: {str(e)}")
            raise

    async def schedule_batch_notifications(
        self,
        notifications: list[Dict[str, Any]],
        delay_minutes: Optional[int] = None
    ) -> None:
        """Schedule batch notifications"""
        try:
            event = {
                "name": "notifications.batch.send",
                "data": {
                    "notifications": notifications
                }
            }
            
            if delay_minutes:
                event["delay"] = delay_minutes * 60
            
            await self.client.send(event)
        except Exception as e:
            logger.error(f"Error scheduling batch notifications: {str(e)}")
            raise

    async def schedule_analytics_report(
        self,
        report_type: str,
        parameters: Dict[str, Any],
        recipient_ids: list[str]
    ) -> None:
        """Schedule analytics report generation"""
        try:
            await self.client.send({
                "name": "analytics.report.generate",
                "data": {
                    "report_type": report_type,
                    "parameters": parameters,
                    "recipient_ids": recipient_ids
                }
            })
        except Exception as e:
            logger.error(f"Error scheduling analytics report: {str(e)}")
            raise

    async def cancel_scheduled_task(self, task_id: str) -> None:
        """Cancel a scheduled task"""
        try:
            await self.client.cancel(task_id)
        except Exception as e:
            logger.error(f"Error canceling task: {str(e)}")
            raise