import uuid
import enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Enum as SAEnum
from app.database import Base


class UserRole(str, enum.Enum):
    STAFF = "staff"
    DAF = "daf"
    SG = "sg"


class Department(str, enum.Enum):
    FINANCE = "finance"
    CLUB_LICENSING = "club_licensing"
    REFEREE = "referee"
    DEVELOPMENT = "development"
    COMPETITION = "competition"
    LEGAL = "legal"
    MARKETING_COMMS = "marketing_comms"
    HR_CONTRACTS = "hr_contracts"


class UserStatus(str, enum.Enum):
    INVITED = "invited"                 # invite generated, account not yet created
    EMAIL_UNVERIFIED = "email_unverified"  # manual signup done, email not confirmed
    ACTIVE = "active"
    DISABLED = "disabled"               # SG has revoked access


def generate_uuid() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)

    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)

    role = Column(SAEnum(UserRole), nullable=False)
    department = Column(SAEnum(Department), nullable=True)  # null for DAF/SG

    status = Column(SAEnum(UserStatus), nullable=False, default=UserStatus.INVITED)

    # Auth
    password_hash = Column(String, nullable=True)   # null if Google-only account
    google_id = Column(String, unique=True, nullable=True)

    # Two-factor authentication
    totp_secret = Column(String, nullable=True)      # set once enrolled
    totp_enabled = Column(Boolean, nullable=False, default=False)

    # Digital signature — stored as base64 PNG, encrypted at rest
    signature_image_encrypted = Column(String, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    last_login_at = Column(DateTime, nullable=True)

    def __repr__(self) -> str:
        return f"<User {self.email} ({self.role})>"