import httpx
import json
import time
import asyncio
from typing import Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
import hashlib
import hmac
import base64
from ..core.config import settings

class GoPayService:
    """
    GoPay QR Payment Integration Service
    Handles QR code generation, status polling, and webhook callbacks
    """

    # GoPay API endpoints (Sandbox - change to production URLs for live)
    BASE_URL = "https://api-sandbox.gopay.com"  # Change to https://api.gopay.com for production
    CREATE_QR_URL = f"{BASE_URL}/api/v1/payment/qr-codes"
    CHECK_STATUS_URL = f"{BASE_URL}/api/v1/payment/qr-codes/{{qr_id}}/status"

    def __init__(self):
        # GoPay credentials - should be in environment variables
        self.client_id = getattr(settings, 'GOPAY_CLIENT_ID', 'your_client_id')
        self.client_secret = getattr(settings, 'GOPAY_CLIENT_SECRET', 'your_client_secret')
        self.merchant_id = getattr(settings, 'GOPAY_MERCHANT_ID', 'your_merchant_id')
        self.api_key = getattr(settings, 'GOPAY_API_KEY', 'your_api_key')

    def _generate_signature(self, method: str, endpoint: str, timestamp: str, body: str = "") -> str:
        """Generate HMAC-SHA256 signature for GoPay API authentication"""
        string_to_sign = f"{method}\n{endpoint}\n{timestamp}\n{body}"
        signature = hmac.new(
            self.api_key.encode('utf-8'),
            string_to_sign.encode('utf-8'),
            hashlib.sha256
        ).digest()
        return base64.b64encode(signature).decode('utf-8')

    def _get_headers(self, method: str, endpoint: str, body: str = "") -> Dict[str, str]:
        """Generate headers for GoPay API requests"""
        timestamp = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
        signature = self._generate_signature(method, endpoint, timestamp, body)

        return {
            'Content-Type': 'application/json',
            'X-TIMESTAMP': timestamp,
            'X-SIGNATURE': signature,
            'X-PARTNER-ID': self.client_id,
            'X-EXTERNAL-ID': f"pasalku-{int(time.time())}",  # Unique external ID
            'Authorization': f'Bearer {self._get_access_token()}'
        }

    def _get_access_token(self) -> str:
        """Get access token for GoPay API (simplified - implement proper token caching)"""
        # In production, implement proper token caching with expiration
        return "your_access_token_here"

    async def create_qr_payment(
        self,
        amount: int,
        order_id: str,
        description: str = "Pasalku AI Payment",
        expiry_minutes: int = 15
    ) -> Dict[str, Any]:
        """
        Create a GoPay QR payment

        Args:
            amount: Payment amount in rupiah (IDR)
            order_id: Unique order identifier
            description: Payment description
            expiry_minutes: QR expiry time in minutes

        Returns:
            Dict containing QR code data and transaction info
        """
        try:
            # Calculate expiry time
            expiry_time = datetime.utcnow() + timedelta(minutes=expiry_minutes)

            payload = {
                "amount": amount,
                "currency": "IDR",
                "order_id": order_id,
                "description": description,
                "expiry_time": int(expiry_time.timestamp() * 1000),  # Unix timestamp in milliseconds
                "callback_url": f"{settings.BASE_URL}/api/payments/gopay/webhook",
                "metadata": {
                    "source": "pasalku_ai",
                    "user_id": "user_id_here"  # Add user context
                }
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.CREATE_QR_URL,
                    json=payload,
                    headers=self._get_headers("POST", "/api/v1/payment/qr-codes", json.dumps(payload))
                )

                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "qr_id": data.get("qr_id"),
                        "qr_string": data.get("qr_string"),
                        "qr_url": data.get("qr_url"),
                        "amount": amount,
                        "order_id": order_id,
                        "expiry_time": expiry_time.isoformat(),
                        "status": "PENDING"
                    }
                else:
                    return {
                        "success": False,
                        "error": f"GoPay API error: {response.status_code}",
                        "details": response.text
                    }

        except Exception as e:
            return {
                "success": False,
                "error": f"Exception occurred: {str(e)}"
            }

    async def check_payment_status(self, qr_id: str) -> Dict[str, Any]:
        """
        Check the status of a GoPay QR payment

        Args:
            qr_id: QR code identifier

        Returns:
            Dict containing payment status information
        """
        try:
            url = self.CHECK_STATUS_URL.format(qr_id=qr_id)

            async with httpx.AsyncClient() as client:
                response = await client.get(
                    url,
                    headers=self._get_headers("GET", f"/api/v1/payment/qr-codes/{qr_id}/status")
                )

                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "qr_id": qr_id,
                        "status": data.get("status"),  # SUCCESS, FAILED, PENDING, EXPIRED
                        "transaction_id": data.get("transaction_id"),
                        "paid_amount": data.get("paid_amount"),
                        "paid_at": data.get("paid_at"),
                        "metadata": data.get("metadata", {})
                    }
                else:
                    return {
                        "success": False,
                        "error": f"Status check failed: {response.status_code}",
                        "qr_id": qr_id
                    }

        except Exception as e:
            return {
                "success": False,
                "error": f"Exception occurred: {str(e)}",
                "qr_id": qr_id
            }

    async def poll_payment_status(
        self,
        qr_id: str,
        max_attempts: int = 60,
        interval_seconds: int = 5
    ) -> Dict[str, Any]:
        """
        Poll payment status until completion or timeout

        Args:
            qr_id: QR code identifier
            max_attempts: Maximum polling attempts
            interval_seconds: Seconds between polls

        Returns:
            Final payment status
        """
        for attempt in range(max_attempts):
            status_result = await self.check_payment_status(qr_id)

            if status_result["success"]:
                current_status = status_result.get("status")
                if current_status in ["SUCCESS", "FAILED", "EXPIRED"]:
                    return status_result

            # Wait before next poll
            await asyncio.sleep(interval_seconds)

        # Timeout reached
        return {
            "success": False,
            "error": "Payment polling timeout",
            "qr_id": qr_id,
            "status": "TIMEOUT"
        }

    async def handle_webhook(self, webhook_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle GoPay webhook callback

        Args:
            webhook_data: Webhook payload from GoPay

        Returns:
            Processing result
        """
        try:
            # Verify webhook signature (implement proper verification)
            qr_id = webhook_data.get("qr_id")
            status = webhook_data.get("status")
            transaction_id = webhook_data.get("transaction_id")

            # Process based on status
            if status == "SUCCESS":
                # Update database, send notifications, etc.
                return {
                    "success": True,
                    "action": "payment_completed",
                    "qr_id": qr_id,
                    "transaction_id": transaction_id
                }
            elif status == "FAILED":
                # Handle failed payment
                return {
                    "success": True,
                    "action": "payment_failed",
                    "qr_id": qr_id,
                    "reason": webhook_data.get("failure_reason")
                }
            else:
                return {
                    "success": True,
                    "action": "status_update",
                    "qr_id": qr_id,
                    "status": status
                }

        except Exception as e:
            return {
                "success": False,
                "error": f"Webhook processing failed: {str(e)}"
            }

# Unified transaction object as requested
class UnifiedTransaction:
    """Unified transaction object for consistent API responses"""

    def __init__(
        self,
        provider: str,
        transaction_id: str,
        order_id: str,
        amount: int,
        currency: str = "IDR",
        status: str = "PENDING",
        qr_code: Optional[str] = None,
        qr_url: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ):
        self.provider = provider
        self.transaction_id = transaction_id
        self.order_id = order_id
        self.amount = amount
        self.currency = currency
        self.status = status
        self.qr_code = qr_code
        self.qr_url = qr_url
        self.metadata = metadata or {}
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for API responses"""
        return {
            "provider": self.provider,
            "transaction_id": self.transaction_id,
            "order_id": self.order_id,
            "amount": self.amount,
            "currency": self.currency,
            "status": self.status,
            "qr_code": self.qr_code,
            "qr_url": self.qr_url,
            "metadata": self.metadata,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

    @classmethod
    def from_gopay_response(cls, gopay_data: Dict[str, Any]) -> 'UnifiedTransaction':
        """Create unified transaction from GoPay response"""
        return cls(
            provider="gopay",
            transaction_id=gopay_data.get("transaction_id", ""),
            order_id=gopay_data.get("order_id", ""),
            amount=gopay_data.get("amount", 0),
            status=gopay_data.get("status", "PENDING"),
            qr_code=gopay_data.get("qr_string"),
            qr_url=gopay_data.get("qr_url"),
            metadata=gopay_data.get("metadata", {})
        )