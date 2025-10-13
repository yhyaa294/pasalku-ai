"""
Unified E-wallet Payment Service
Supports multiple Indonesian payment providers: GoPay, OVO, DANA, ShopeePay
"""

import asyncio
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from datetime import datetime
from ..core.config import settings

class EwalletProvider(ABC):
    """Abstract base class for e-wallet providers"""

    @property
    @abstractmethod
    def name(self) -> str:
        """Provider name"""
        pass

    @abstractmethod
    async def create_payment(self, amount: int, order_id: str, **kwargs) -> Dict[str, Any]:
        """Create payment request"""
        pass

    @abstractmethod
    async def check_status(self, transaction_id: str) -> Dict[str, Any]:
        """Check payment status"""
        pass

    @abstractmethod
    async def handle_webhook(self, webhook_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle webhook callback"""
        pass

class GoPayProvider(EwalletProvider):
    """GoPay implementation"""

    @property
    def name(self) -> str:
        return "gopay"

    async def create_payment(self, amount: int, order_id: str, **kwargs) -> Dict[str, Any]:
        from .gopay_service import GoPayService
        service = GoPayService()
        return await service.create_qr_payment(
            amount,
            order_id,
            kwargs.get('description', 'Pasalku AI Payment'),
            kwargs.get('expiry_minutes', 15)
        )

    async def check_status(self, transaction_id: str) -> Dict[str, Any]:
        from .gopay_service import GoPayService
        service = GoPayService()
        return await service.check_payment_status(transaction_id)

    async def handle_webhook(self, webhook_data: Dict[str, Any]) -> Dict[str, Any]:
        from .gopay_service import GoPayService
        service = GoPayService()
        return await service.handle_webhook(webhook_data)

class OVOProvider(EwalletProvider):
    """OVO implementation"""

    @property
    def name(self) -> str:
        return "ovo"

    async def create_payment(self, amount: int, order_id: str, **kwargs) -> Dict[str, Any]:
        # OVO API implementation
        # This would integrate with OVO's Push to Pay API
        return {
            "success": False,
            "error": "OVO integration not yet implemented",
            "provider": self.name
        }

    async def check_status(self, transaction_id: str) -> Dict[str, Any]:
        return {
            "success": False,
            "error": "OVO integration not yet implemented",
            "provider": self.name
        }

    async def handle_webhook(self, webhook_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "success": False,
            "error": "OVO integration not yet implemented",
            "provider": self.name
        }

class DANAProvider(EwalletProvider):
    """DANA implementation"""

    @property
    def name(self) -> str:
        return "dana"

    async def create_payment(self, amount: int, order_id: str, **kwargs) -> Dict[str, Any]:
        # DANA API implementation
        return {
            "success": False,
            "error": "DANA integration not yet implemented",
            "provider": self.name
        }

    async def check_status(self, transaction_id: str) -> Dict[str, Any]:
        return {
            "success": False,
            "error": "DANA integration not yet implemented",
            "provider": self.name
        }

    async def handle_webhook(self, webhook_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "success": False,
            "error": "DANA integration not yet implemented",
            "provider": self.name
        }

class ShopeePayProvider(EwalletProvider):
    """ShopeePay implementation"""

    @property
    def name(self) -> str:
        return "shopeepay"

    async def create_payment(self, amount: int, order_id: str, **kwargs) -> Dict[str, Any]:
        # ShopeePay API implementation
        return {
            "success": False,
            "error": "ShopeePay integration not yet implemented",
            "provider": self.name
        }

    async def check_status(self, transaction_id: str) -> Dict[str, Any]:
        return {
            "success": False,
            "error": "ShopeePay integration not yet implemented",
            "provider": self.name
        }

    async def handle_webhook(self, webhook_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "success": False,
            "error": "ShopeePay integration not yet implemented",
            "provider": self.name
        }

class UnifiedEwalletService:
    """
    Unified service for handling multiple e-wallet providers
    """

    def __init__(self):
        self.providers: Dict[str, EwalletProvider] = {
            'gopay': GoPayProvider(),
            'ovo': OVOProvider(),
            'dana': DANAProvider(),
            'shopeepay': ShopeePayProvider(),
        }

    def get_available_providers(self) -> List[str]:
        """Get list of available payment providers"""
        return list(self.providers.keys())

    def get_provider(self, provider_name: str) -> Optional[EwalletProvider]:
        """Get provider instance by name"""
        return self.providers.get(provider_name.lower())

    async def create_payment(
        self,
        provider: str,
        amount: int,
        order_id: str,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Create payment using specified provider

        Args:
            provider: Payment provider name (gopay, ovo, dana, shopeepay)
            amount: Payment amount in rupiah
            order_id: Unique order identifier
            **kwargs: Additional provider-specific parameters

        Returns:
            Unified payment response
        """
        provider_instance = self.get_provider(provider)
        if not provider_instance:
            return {
                "success": False,
                "error": f"Unsupported provider: {provider}",
                "available_providers": self.get_available_providers()
            }

        try:
            result = await provider_instance.create_payment(amount, order_id, **kwargs)

            # Add unified metadata
            if result.get("success"):
                result.update({
                    "provider": provider,
                    "unified_transaction": self._create_unified_transaction(provider, result)
                })

            return result

        except Exception as e:
            return {
                "success": False,
                "error": f"Payment creation failed: {str(e)}",
                "provider": provider
            }

    async def check_payment_status(
        self,
        provider: str,
        transaction_id: str
    ) -> Dict[str, Any]:
        """
        Check payment status using specified provider

        Args:
            provider: Payment provider name
            transaction_id: Transaction identifier

        Returns:
            Unified status response
        """
        provider_instance = self.get_provider(provider)
        if not provider_instance:
            return {
                "success": False,
                "error": f"Unsupported provider: {provider}"
            }

        try:
            result = await provider_instance.check_status(transaction_id)

            # Add unified metadata
            if result.get("success"):
                result.update({
                    "provider": provider,
                    "unified_status": self._normalize_status(provider, result.get("status", ""))
                })

            return result

        except Exception as e:
            return {
                "success": False,
                "error": f"Status check failed: {str(e)}",
                "provider": provider
            }

    async def handle_webhook(
        self,
        provider: str,
        webhook_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Handle webhook callback from specified provider

        Args:
            provider: Payment provider name
            webhook_data: Webhook payload

        Returns:
            Unified webhook response
        """
        provider_instance = self.get_provider(provider)
        if not provider_instance:
            return {
                "success": False,
                "error": f"Unsupported provider: {provider}"
            }

        try:
            result = await provider_instance.handle_webhook(webhook_data)

            # Add unified metadata
            result.update({
                "provider": provider,
                "processed_at": datetime.utcnow().isoformat()
            })

            return result

        except Exception as e:
            return {
                "success": False,
                "error": f"Webhook processing failed: {str(e)}",
                "provider": provider
            }

    async def poll_payment_status(
        self,
        provider: str,
        transaction_id: str,
        max_attempts: int = 60,
        interval_seconds: int = 5
    ) -> Dict[str, Any]:
        """
        Poll payment status until completion or timeout

        Args:
            provider: Payment provider name
            transaction_id: Transaction identifier
            max_attempts: Maximum polling attempts
            interval_seconds: Seconds between polls

        Returns:
            Final payment status
        """
        for attempt in range(max_attempts):
            status_result = await self.check_payment_status(provider, transaction_id)

            if status_result.get("success"):
                current_status = status_result.get("status")
                # Check if payment is completed (customize based on provider)
                if current_status in ["SUCCESS", "COMPLETED", "PAID"]:
                    return status_result
                elif current_status in ["FAILED", "EXPIRED", "CANCELLED"]:
                    return status_result

            # Wait before next poll
            await asyncio.sleep(interval_seconds)

        # Timeout reached
        return {
            "success": False,
            "error": "Payment polling timeout",
            "provider": provider,
            "transaction_id": transaction_id,
            "status": "TIMEOUT"
        }

    def _create_unified_transaction(self, provider: str, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create unified transaction object from provider-specific data"""
        from .gopay_service import UnifiedTransaction

        # This is a simplified version - in production, you'd have provider-specific mapping
        return {
            "provider": provider,
            "transaction_id": payment_data.get("qr_id") or payment_data.get("transaction_id", ""),
            "order_id": payment_data.get("order_id", ""),
            "amount": payment_data.get("amount", 0),
            "currency": "IDR",
            "status": self._normalize_status(provider, payment_data.get("status", "PENDING")),
            "qr_code": payment_data.get("qr_string"),
            "qr_url": payment_data.get("qr_url"),
            "metadata": payment_data.get("metadata", {}),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }

    def _normalize_status(self, provider: str, status: str) -> str:
        """Normalize provider-specific status to unified status"""
        status = status.upper()

        # Common status mappings
        if status in ["SUCCESS", "COMPLETED", "PAID", "SETTLED"]:
            return "completed"
        elif status in ["FAILED", "DECLINED", "REJECTED"]:
            return "failed"
        elif status in ["PENDING", "PROCESSING", "WAITING"]:
            return "pending"
        elif status in ["EXPIRED", "TIMEOUT"]:
            return "expired"
        elif status in ["CANCELLED", "VOIDED"]:
            return "cancelled"
        else:
            return "unknown"

# Global instance
ewallet_service = UnifiedEwalletService()