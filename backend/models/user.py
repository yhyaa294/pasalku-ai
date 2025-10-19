"""
Enhanced User Models dengan Clerk Integration dan RBAC
"""
import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, String, Enum, Text, DateTime, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..database import Base


class UserRole(str, enum.Enum):
    """User roles untuk RBAC"""
    MASYARAKAT_UMUM = "masyarakat_umum"  # Default role untuk semua registrasi
    PROFESIONAL_HUKUM = "profesional_hukum"  # Verified legal professionals
    ADMIN = "admin"  # System administrators


class VerificationStatus(str, enum.Enum):
    """Status verifikasi untuk upgrade ke profesional hukum"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    NOT_REQUESTED = "not_requested"


class SubscriptionTier(str, enum.Enum):
    """Subscription tiers"""
    FREE = "free"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"


class User(Base):
    """
    Enhanced User model dengan Clerk integration.
    Clerk handles authentication, kita store additional metadata.
    """
    __tablename__ = "users"

    # Primary key - UUID for database consistency
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Clerk user ID for integration
    clerk_user_id = Column(String, unique=True, nullable=True, index=True)
    
    # Basic info (synced from Clerk)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    
    # Role & Permissions
    role = Column(
        Enum(UserRole), 
        nullable=False, 
        default=UserRole.MASYARAKAT_UMUM,
        index=True
    )
    
    # Subscription info
    subscription_tier = Column(
        Enum(SubscriptionTier),
        nullable=False,
        default=SubscriptionTier.FREE
    )
    stripe_customer_id = Column(String, unique=True, nullable=True, index=True)
    stripe_subscription_id = Column(String, unique=True, nullable=True)
    subscription_status = Column(String, nullable=True)  # active, canceled, past_due, etc.
    subscription_expires_at = Column(DateTime, nullable=True)
    
    # Professional verification (untuk upgrade ke profesional_hukum)
    verification_status = Column(
        Enum(VerificationStatus),
        nullable=False,
        default=VerificationStatus.NOT_REQUESTED
    )
    verification_requested_at = Column(DateTime, nullable=True)
    verification_documents = Column(JSON, nullable=True)  # Array of document references
    verification_notes = Column(Text, nullable=True)  # Admin notes
    verified_at = Column(DateTime, nullable=True)
    verified_by = Column(String, nullable=True)  # Admin user ID who verified
    
    # Professional info (for legal professionals)
    professional_license_number = Column(String, nullable=True)
    professional_organization = Column(String, nullable=True)  # e.g., "Peradi", "HKHPM"
    professional_specialization = Column(JSON, nullable=True)  # Array of specializations
    professional_bio = Column(Text, nullable=True)
    
    # Usage tracking
    ai_queries_count = Column(Integer, default=0)  # Total AI queries
    ai_queries_this_month = Column(Integer, default=0)  # Reset monthly
    documents_uploaded_count = Column(Integer, default=0)
    last_query_at = Column(DateTime, nullable=True)
    
    # Account status
    is_active = Column(Boolean, default=True, nullable=False)
    is_email_verified = Column(Boolean, default=False)
    is_phone_verified = Column(Boolean, default=False)
    
    # Metadata
    user_metadata = Column(JSON, nullable=True)  # Additional flexible metadata
    preferences = Column(JSON, nullable=True)  # User preferences (theme, language, etc.)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_login_at = Column(DateTime, nullable=True)
    
    # Relationships
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")
    consultation_sessions = relationship("ConsultationSession", back_populates="user", cascade="all, delete-orphan")
    subscriptions = relationship("Subscription", back_populates="user", cascade="all, delete-orphan")
    verification_requests = relationship("VerificationRequest", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
    
    @property
    def is_premium(self) -> bool:
        """Check if user has premium subscription"""
        return self.subscription_tier in [SubscriptionTier.PREMIUM, SubscriptionTier.ENTERPRISE]
    
    @property
    def is_professional(self) -> bool:
        """Check if user is verified legal professional"""
        return self.role == UserRole.PROFESIONAL_HUKUM
    
    @property
    def is_admin(self) -> bool:
        """Check if user is admin"""
        return self.role == UserRole.ADMIN
    
    @property
    def can_access_advanced_features(self) -> bool:
        """Check if user can access advanced features"""
        return self.is_premium or self.is_professional or self.is_admin
    
    def has_remaining_queries(self, limit: int = 10) -> bool:
        """Check if user has remaining queries for the month (for free tier)"""
        if self.is_premium:
            return True  # Unlimited for premium
        return self.ai_queries_this_month < limit


class VerificationRequest(Base):
    """
    Track verification requests untuk upgrade ke profesional hukum
    """
    __tablename__ = "verification_requests"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(String, nullable=False, index=True)
    
    # Request details
    request_type = Column(String, nullable=False, default="professional_upgrade")
    status = Column(
        Enum(VerificationStatus),
        nullable=False,
        default=VerificationStatus.PENDING
    )
    
    # Documents submitted
    documents = Column(JSON, nullable=True)  # Array of document metadata
    license_number = Column(String, nullable=True)
    organization = Column(String, nullable=True)
    specialization = Column(JSON, nullable=True)
    bio = Column(Text, nullable=True)
    
    # Review process
    reviewed_by = Column(String, nullable=True)  # Admin user ID
    reviewed_at = Column(DateTime, nullable=True)
    review_notes = Column(Text, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="verification_requests")
    
    def __repr__(self):
        return f"<VerificationRequest(id={self.id}, user_id={self.user_id}, status={self.status})>"


class Subscription(Base):
    """
    Track subscription history dan changes
    """
    __tablename__ = "subscriptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(String, nullable=False, index=True)
    
    # Stripe info
    stripe_subscription_id = Column(String, unique=True, nullable=True, index=True)
    stripe_customer_id = Column(String, nullable=True)
    stripe_price_id = Column(String, nullable=True)
    
    # Subscription details
    tier = Column(Enum(SubscriptionTier), nullable=False)
    status = Column(String, nullable=False)  # active, canceled, past_due, etc.
    
    # Billing
    amount = Column(Integer, nullable=True)  # Amount in cents
    currency = Column(String, nullable=False, default="idr")
    billing_cycle = Column(String, nullable=True)  # monthly, yearly
    
    # Dates
    started_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    current_period_start = Column(DateTime, nullable=True)
    current_period_end = Column(DateTime, nullable=True)
    canceled_at = Column(DateTime, nullable=True)
    ended_at = Column(DateTime, nullable=True)
    
    # Metadata
    subscription_metadata = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="subscriptions")
    
    def __repr__(self):
        return f"<Subscription(id={self.id}, user_id={self.user_id}, tier={self.tier}, status={self.status})>"


class AuditLog(Base):
    """
    Audit log untuk tracking semua actions (security & compliance)
    """
    __tablename__ = "audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Who
    user_id = Column(String, nullable=True, index=True)  # Nullable for system actions
    user_email = Column(String, nullable=True)
    user_role = Column(String, nullable=True)
    
    # What
    action = Column(String, nullable=False, index=True)  # e.g., "user.login", "role.changed"
    resource_type = Column(String, nullable=True)  # e.g., "user", "subscription"
    resource_id = Column(String, nullable=True)
    
    # Details
    description = Column(Text, nullable=True)
    audit_metadata = Column(JSON, nullable=True)
    
    # Context
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    request_id = Column(String, nullable=True)
    
    # Result
    status = Column(String, nullable=False)  # success, failure
    error_message = Column(Text, nullable=True)
    
    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    def __repr__(self):
        return f"<AuditLog(id={self.id}, action={self.action}, user_id={self.user_id})>"
