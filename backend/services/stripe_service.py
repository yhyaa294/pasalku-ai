import stripe
from ..core.config import settings

# Configure the Stripe API client
stripe.api_key = settings.STRIPE_SECRET_KEY

def create_checkout_session(user_email: str, price_id: str) -> stripe.checkout.Session:
    """
    Creates a Stripe Checkout session for a subscription.
    """
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    'price': price_id,
                    'quantity': 1,
                },
            ],
            mode='subscription',
            success_url='https://your-frontend.com/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='https://your-frontend.com/cancel',
            customer_email=user_email,
        )
        return checkout_session
    except Exception as e:
        # Handle potential errors, e.g., invalid price ID
        print(f"Error creating Stripe checkout session: {e}")
        raise
