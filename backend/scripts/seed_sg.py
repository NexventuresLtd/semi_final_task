"""
Creates the first Secretary General account — the only account in the
system that isn't created via an SG-issued invitation, since there's no
SG yet to issue one. Run this exactly once, right after the database is
created, then change the seeded password immediately on first login.

Usage:
    python -m scripts.seed_sg
"""
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models.user import User, UserRole, UserStatus
from app.core.security import hash_password
from app.config import settings


def seed_sg():
    # Ensure tables exist (in real deployments this is handled by Alembic
    # migrations instead — see Step 12 — but this keeps the script
    # self-sufficient for a first-time local run)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.role == UserRole.SG).first()
        if existing:
            print(f"An SG account already exists: {existing.email}. Aborting — "
                  f"this script only ever creates the very first SG account.")
            return

        sg_user = User(
            email=settings.seed_sg_email,
            name=settings.seed_sg_name,
            role=UserRole.SG,
            department=None,
            status=UserStatus.ACTIVE,
            password_hash=hash_password(settings.seed_sg_password),
        )
        db.add(sg_user)
        db.commit()

        print("Secretary General account created successfully:")
        print(f"  Email:    {sg_user.email}")
        print(f"  Password: {settings.seed_sg_password}")
        print()
        print("IMPORTANT: sign in immediately and change this password, "
              "then enroll two-factor authentication before using this "
              "account for anything else.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_sg()