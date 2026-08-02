from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.models.user import User
from app.services.email_service import approval_notification_html, invite_email_html
from app.tasks.email_tasks import send_email_task
import asyncio
from app.core.ws_manager import manager

BLUE = "#0F6FA8"


def _new_request_email_html(request_title: str, requester_name: str, department: str) -> str:
    from app.services.email_service import _email_shell, INK, MUTED, SURFACE
    inner = f"""
      <h2 style="margin:0 0 12px; color:{INK}; font-size:20px; font-weight:600;">New request awaiting your review</h2>
      <p style="margin:0 0 8px; color:{MUTED}; font-size:14px; line-height:1.6;">
        <b style="color:{INK};">{requester_name}</b> ({department}) submitted a request that needs your decision.
      </p>
      <div style="background:{SURFACE}; border-radius:8px; padding:14px 16px; margin:16px 0;">
        <p style="margin:0; color:{INK}; font-size:14px; font-weight:600;">{request_title}</p>
      </div>
    """
    return _email_shell(inner)


def notify_new_request(db: Session, approver: User, request_title: str, requester: User, request_id: str):
    notif = Notification(
        user_id=approver.id,
        type="new_request",
        title="New request to review",
        message=f"{requester.name} submitted \"{request_title}\"",
        request_id=request_id,
    )
    db.add(notif)
    push(notif)

    send_email_task.delay(
        to_email=approver.email,
        subject=f"New request awaiting your review — {request_title}",
        html_body=_new_request_email_html(request_title, requester.name, requester.department or "—"),
    )


def notify_decision(db: Session, requester: User, decision: str, stage_label: str, request_title: str, request_id: str, comment: str | None):
    notif = Notification(
        user_id=requester.id,
        type="approved" if decision == "approved" else "rejected",
        title="Request approved" if decision == "approved" else "Request rejected",
        message=f"\"{request_title}\" was {decision} by {stage_label}",
        request_id=request_id,
    )
    db.add(notif)
    push(notif)

    send_email_task.delay(
        to_email=requester.email,
        subject=f"Your request was {decision} — {request_title}",
        html_body=approval_notification_html(request_title, decision, stage_label, comment),
    )

def push(notif):
    """Fire-and-forget WebSocket push from a sync or async route handler.

    Sync FastAPI handlers run in a threadpool — asyncio.get_event_loop() there
    returns a different (often already-closed) loop. Instead we grab the uvicorn
    event loop stored at startup in ws_loop.loop and use run_coroutine_threadsafe,
    which is the only safe way to schedule a coroutine from a foreign thread.
    """
    from app.core import ws_loop

    payload = {
        "id": str(notif.id) if notif.id else None,
        "type": notif.type,
        "title": notif.title,
        "message": notif.message,
        "requestId": notif.request_id,
    }

    loop = ws_loop.loop
    if loop is None or not loop.is_running():
        # Startup hasn't finished or server is shutting down — skip push.
        # The notification is already in the DB and will appear on next poll.
        return

    asyncio.run_coroutine_threadsafe(
        manager.push_to_user(notif.user_id, payload), loop
    )