import stripe
from typing import Dict, Any, Optional
from ..core.config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

class PaymentService:
    @staticmethod
    async def create_checkout_session(
        user_id: str,
        product_id: str,
        success_url: str,
        cancel_url: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Create a Stripe checkout session"""
        try:
            # Set default metadata
            if metadata is None:
                metadata = {}
            
            metadata["user_id"] = str(user_id)
            
            # Create checkout session
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[
                    {
                        "price": product_id,  # Stripe Price ID
                        "quantity": 1,
                    },
                ],
                mode="subscription",  # or "payment" for one-time payments
                success_url=success_url,
                cancel_url=cancel_url,
                metadata=metadata,
                customer_email=None,  # Can be set if you have user's email
            )
            
            return {
                "session_id": session.id,
                "url": session.url
            }
        
        except stripe.error.StripeError as e:
            raise Exception(f"Stripe error: {str(e)}")

    @staticmethod
    async def handle_webhook(
        payload: bytes,
        sig_header: str,
        webhook_secret: str
    ) -> Dict[str, Any]:
        """Handle Stripe webhook events"""
        try:
            # Verify webhook signature
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
            
            # Handle specific events
            if event.type == "checkout.session.completed":
                return await PaymentService._handle_successful_payment(event.data.object)
            
            elif event.type == "customer.subscription.updated":
                return await PaymentService._handle_subscription_update(event.data.object)
            
            elif event.type == "customer.subscription.deleted":
                return await PaymentService._handle_subscription_cancelled(event.data.object)
            
            return {
                "status": "success",
                "message": f"Unhandled event type: {event.type}"
            }
            
        except stripe.error.SignatureVerificationError:
            raise Exception("Invalid webhook signature")
        except Exception as e:
            raise Exception(f"Webhook error: {str(e)}")

    @staticmethod
    async def create_portal_session(
        customer_id: str,
        return_url: str
    ) -> Dict[str, str]:
        """Create a Stripe customer portal session"""
        try:
            session = stripe.billing_portal.Session.create(
                customer=customer_id,
                return_url=return_url,
            )
            
            return {
                "url": session.url
            }
            
        except stripe.error.StripeError as e:
            raise Exception(f"Stripe error: {str(e)}")

    @staticmethod
    async def _handle_successful_payment(session: Dict[str, Any]) -> Dict[str, Any]:
        """Handle successful payment completion"""
        try:
            # Get metadata
            metadata = session.get("metadata", {})
            user_id = metadata.get("user_id")
            
            if not user_id:
                raise Exception("Missing user_id in session metadata")
            
            # TODO: Update user's subscription status in database
            
            return {
                "status": "success",
                "user_id": user_id,
                "session_id": session.id
            }
            
        except Exception as e:
            raise Exception(f"Error handling payment: {str(e)}")

    @staticmethod
    async def _handle_subscription_update(subscription: Dict[str, Any]) -> Dict[str, Any]:
        """Handle subscription updates"""
        try:
            customer_id = subscription.get("customer")
            status = subscription.get("status")
            
            # TODO: Update subscription status in database
            
            return {
                "status": "success",
                "customer_id": customer_id,
                "subscription_status": status
            }
            
        except Exception as e:
            raise Exception(f"Error handling subscription update: {str(e)}")

    @staticmethod
    async def _handle_subscription_cancelled(subscription: Dict[str, Any]) -> Dict[str, Any]:
        """Handle subscription cancellations"""
        try:
            customer_id = subscription.get("customer")
            
            # TODO: Update subscription status in database
            
            return {
                "status": "success",
                "customer_id": customer_id,
                "message": "Subscription cancelled"
            }
            
        except Exception as e:
            raise Exception(f"Error handling subscription cancellation: {str(e)}")