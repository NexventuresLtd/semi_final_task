"""
Deletes all users except the SG account(s), plus every dependent record
tied to those deleted users (invites, requests, comments, sessions,
notifications, audit logs) — so you can restart testing with a clean
slate while keeping your seeded SG login intact.

Templates are left untouched since they aren't user-specific data.

Usage:
    python -m scripts.reset_except_sg
"""
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models.user import User, UserRole
from app.models.invite import Invite
from app.models.request import RequestRecord
from app.models.comment import RequestComment
from app.models.session import LoginSession
from app.models.notification import Notification
from app.models.audit_log import AuditLog


def reset_except_sg():
    db = SessionLocal()
    try:
        sg_users = db.query(User).filter(User.role == UserRole.SG).all()
        sg_ids = [u.id for u in sg_users]

        if not sg_ids:
            print("No SG account found — aborting to avoid wiping everything with nothing to keep.")
            return

        non_sg_users = db.query(User).filter(~User.id.in_(sg_ids)).all()
        non_sg_ids = [u.id for u in non_sg_users]

        print(f"Keeping {len(sg_ids)} SG account(s): {[u.email for u in sg_users]}")
        print(f"Deleting {len(non_sg_ids)} other user(s) and all their related data...")

        # Requests submitted by deleted users, or currently sitting with
        # them as the requester — delete comments/requests tied to them
        request_ids_to_delete = [
            r.id for r in db.query(RequestRecord).filter(RequestRecord.requester_id.in_(non_sg_ids)).all()
        ] if non_sg_ids else []

        if request_ids_to_delete:
            db.query(RequestComment).filter(RequestComment.request_id.in_(request_ids_to_delete)).delete(synchronize_session=False)
            db.query(RequestRecord).filter(RequestRecord.id.in_(request_ids_to_delete)).delete(synchronize_session=False)

        # Notifications, sessions, audit logs tied to deleted users
        if non_sg_ids:
            db.query(Notification).filter(Notification.user_id.in_(non_sg_ids)).delete(synchronize_session=False)
            db.query(LoginSession).filter(LoginSession.user_id.in_(non_sg_ids)).delete(synchronize_session=False)
            db.query(AuditLog).filter(AuditLog.actor_id.in_(non_sg_ids)).delete(synchronize_session=False)

        # All invites (whether used or not) — safe to fully clear since
        # nothing legitimate should reference an invite after this reset
        db.query(Invite).delete(synchronize_session=False)

        # Finally, the users themselves
        if non_sg_ids:
            db.query(User).filter(User.id.in_(non_sg_ids)).delete(synchronize_session=False)

        db.commit()
        print("Reset complete. Only SG account(s) remain, with no leftover requests, invites, sessions, or logs.")

    finally:
        db.close()


if __name__ == "__main__":
    reset_except_sg()