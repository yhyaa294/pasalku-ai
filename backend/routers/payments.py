import stripe
from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.core.config import get_settings
from backend.models import User, ChatSession, Payment
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

settings = get_settings()
stripe.api_key = settings.STRIPE_SECRET_KEY

router = APIRouter()

class SubscriptionCreateRequest(BaseModel):
    price_id: str
    email: str
    success_url: str = "http://localhost:3000/success"
    cancel_url: str = "http://localhost:3000/cancel"

class PaymentIntentRequest(BaseModel):
    amount: int  # Amount in cents
    currency: str = "usd"
    description: str = "Legal Consultation Payment"
    metadata: Optional[dict] = None

class PaymentResponse(BaseModel):
    client_secret: str
    payment_intent_id: str
    amount: int
    currency: str

@router.post("/create-subscription", response_model=dict)
async def create_subscription(request: SubscriptionCreateRequest, db: Session = Depends(get_db)):
    """Create a Stripe subscription for a user."""
    try:
        # Check if user exists or create anonymous session
        if request.email:
            user = db.query(User).filter(User.email == request.email).first()
            if user:
                customer_id = getattr(user, 'stripe_customer_id', None)
            else:
                # Create new Stripe customer for guest user
                customer = stripe.Customer.create(email=request.email)
                customer_id = customer.id
        else:
            # Create customer for anonymous user
            customer = stripe.Customer.create()
            customer_id = customer.id

        # Create subscription
        subscription_data = {
            "customer": customer_id,
            "items": [{"price": request.price_id}],
            "payment_behavior": "default_incomplete",
            "expand": ["latest_invoice.payment_intent"],
            "success_url": request.success_url,
            "cancel_url": request.cancel_url
        }

        subscription = stripe.Subscription.create(**subscription_data)

        return {
            "subscriptionId": subscription.id,
            "clientSecret": subscription.latest_invoice.payment_intent.client_secret,
        }

    except stripe.error.StripeError as e:
        logger.error(f"Stripe subscription creation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/create-payment-intent", response_model=PaymentResponse)
async def create_payment_intent(request: PaymentIntentRequest, db: Session = Depends(get_db)):
    """Create a one-time payment intent for consultation services."""
    try:
        payment_intent_data = {
            "amount": request.amount,
            "currency": request.currency,
            "description": request.description,
            "metadata": request.metadata or {},
            "automatic_payment_methods": {"enabled": True},
        }

        payment_intent = stripe.PaymentIntent.create(**payment_intent_data)

        return PaymentResponse(
            client_secret=payment_intent.client_secret,
            payment_intent_id=payment_intent.id,
            amount=payment_intent.amount,
            currency=payment_intent.currency
        )

    except stripe.error.StripeError as e:
        logger.error(f"Stripe payment intent creation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhook events."""
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_MCP_KEY
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle different event types
    if event.type == 'payment_intent.succeeded':
        payment_intent = event.data.object
        logger.info(f"Payment succeeded: {payment_intent.id}")

        # Store successful payment in database
        payment_record = Payment(
            stripe_payment_intent_id=payment_intent.id,
            stripe_customer_id=payment_intent.customer,
            amount=payment_intent.amount,
            currency=payment_intent.currency,
            status="succeeded",
            payment_type="one_time",
            description=getattr(payment_intent, 'description', 'Legal consultant payment')
        )
        db.add(payment_record)
        db.commit()

    elif event.type == 'payment_intent.payment_failed':
        payment_intent = event.data.object
        logger.info(f"Payment failed: {payment_intent.id}")

        # Store failed payment
        payment_record = Payment(
            stripe_payment_intent_id=payment_intent.id,
            stripe_customer_id=getattr(payment_intent, 'customer', None),
            amount=payment_intent.amount,
            currency=payment_intent.currency,
            status="failed",
            payment_type="one_time",
            description=getattr(payment_intent, 'description', 'Legal consultant payment')
        )
        db.add(payment_record)
        db.commit()

    elif event.type == 'customer.subscription.created':
        subscription = event.data.object
        logger.info(f"Subscription created: {subscription.id}")

        # Store subscription payment
        payment_record = Payment(
            stripe_subscription_id=subscription.id,
            stripe_customer_id=subscription.customer,
            amount=subscription.items.data[0].price.unit_amount,
            currency=subscription.currency,
            status="active",
            payment_type="subscription",
            product_id=subscription.items.data[0].price.id,
            description=f"Subscription: {subscription.items.data[0].price.nickname or 'Legal Service'}"
        )
        db.add(payment_record)
        db.commit()

    elif event.type == 'customer.subscription.updated':
        subscription = event.data.object
        logger.info(f"Subscription updated: {subscription.id}")

    elif event.type == 'customer.subscription.deleted':
        subscription = event.data.object
        logger.info(f"Subscription cancelled: {subscription.id}")

        # Update subscription status to cancelled
        payment_record = db.query(Payment).filter(
            Payment.stripe_subscription_id == subscription.id
        ).first()
        if payment_record:
            payment_record.status = "cancelled"
            db.commit()

    return {"status": "success"}

@router.get("/subscription-plans")
async def get_subscription_plans():
    """Get available subscription plans."""
    try:
        # In a real implementation, you'd fetch this from Stripe Products
        plans = [
            {
                "id": "basic_consultation",
                "name": "Basic Consultation",
                "price": 2500,  # $25.00
                "currency": "usd",
                "interval": "one_time",
                "description": "One-time legal consultation"
            },
            {
                "id": "premium_monthly",
                "name": "Premium Monthly",
                "price": 9900,  # $99.00
                "currency": "usd",
                "interval": "month",
                "description": "Unlimited consultations for one month"
            },
            {
                "id": "enterprise_yearly",
                "name": "Enterprise Yearly",
                "price": 99900,  # $999.00
                "currency": "usd",
                "interval": "year",
                "description": "Complete legal assistance package"
            }
        ]
        return {"plans": plans}
    except Exception as e:
        logger.error(f"Error fetching subscription plans: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch plans")

@router.get("/payment-history/{user_id}")
async def get_payment_history(user_id: str, db: Session = Depends(get_db)):
    """Get payment history for a user."""
    try:
        from uuid import UUID
        user_uuid = UUID(user_id)

        # Query payments for the user
        payments = db.query(Payment).filter(Payment.user_id == user_uuid).order_by(Payment.created_at.desc()).all()

        payment_history = []
        for payment in payments:
            payment_history.append({
                "id": str(payment.id),
                "amount": payment.amount,
                "currency": payment.currency,
                "status": payment.status,
                "payment_type": payment.payment_type,
                "date": payment.created_at.isoformat(),
                "description": payment.description or "Legal Consultation",
                "stripe_payment_intent_id": payment.stripe_payment_intent_id,
                "stripe_subscription_id": payment.stripe_subscription_id
            })

        return {
            "payments": payment_history,
            "total_count": len(payment_history)
        }
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    except Exception as e:
        logger.error(f"Error fetching payment history: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch payment history")

@router.get("/payments")
async def get_all_payments(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    """Get all payments (admin endpoint)."""
    try:
        payments = db.query(Payment).order_by(Payment.created_at.desc()).offset(offset).limit(limit).all()

        payment_list = []
        for payment in payments:
            payment_list.append({
                "id": str(payment.id),
                "user_id": str(payment.user_id) if payment.user_id else None,
                "amount": payment.amount,
                "currency": payment.currency,
                "status": payment.status,
                "payment_type": payment.payment_type,
                "date": payment.created_at.isoformat(),
                "description": payment.description or "Legal Consultation"
            })

        total_count = db.query(Payment).count()

        return {
            "payments": payment_list,
            "total_count": total_count,
            "limit": limit,
            "offset": offset
        }
    except Exception as e:
        logger.error(f"Error fetching payments: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch payments")