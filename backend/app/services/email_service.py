import os
import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from app.config import settings

# backend/images/ferwafa-logo.png — adjust if you placed it elsewhere
LOGO_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "images", "ferwafa-logo.png")
LOGO_CID = "ferwafa-logo"

BLUE = "#0F6FA8"
INK = "#12151B"
MUTED = "#5B6472"
BORDER = "#E5E8EC"
SURFACE = "#F7F8FA"


async def send_email(to_email: str, subject: str, html_body: str):
    message = MIMEMultipart("related")
    message["From"] = f"FERWAFA Approvals <{settings.email_sender_email}>"
    message["To"] = to_email
    message["Subject"] = subject

    alt_part = MIMEMultipart("alternative")
    alt_part.attach(MIMEText(html_body, "html"))
    message.attach(alt_part)

    # Inline-embed the logo so it renders even when remote images are
    # blocked by default (Gmail, Outlook, etc.) — referenced in HTML
    # via cid:ferwafa-logo rather than a hosted URL.
    if os.path.exists(LOGO_PATH):
        with open(LOGO_PATH, "rb") as f:
            logo = MIMEImage(f.read())
        logo.add_header("Content-ID", f"<{LOGO_CID}>")
        logo.add_header("Content-Disposition", "inline", filename="ferwafa-logo.png")
        message.attach(logo)

    await aiosmtplib.send(
        message,
        hostname=settings.email_smtp_server,
        port=settings.email_smtp_port,
        username=settings.email_login,
        password=settings.email_sender_password,
        start_tls=True,
    )


def _email_shell(inner_html: str) -> str:
    """Shared wrapper — header with logo, consistent footer, on every email."""
    return f"""
    <div style="background:{SURFACE}; padding:32px 16px; font-family:'Helvetica Neue', Arial, sans-serif;">
      <div style="max-width:480px; margin:0 auto; background:#ffffff; border:1px solid {BORDER}; border-radius:16px; overflow:hidden;">

        <div style="background:{INK}; padding:28px 32px; text-align:center;">
          <img src="cid:{LOGO_CID}" alt="FERWAFA" width="52" height="52" style="display:inline-block; margin-bottom:10px;" />
          <p style="margin:0; color:#ffffff; font-size:13px; letter-spacing:1px; font-weight:600; text-transform:uppercase;">
            FERWAFA · Departments Approvals
          </p>
        </div>

        <div style="padding:32px;">
          {inner_html}
        </div>

        <div style="padding:20px 32px; border-top:1px solid {BORDER}; text-align:center;">
          <p style="margin:0; color:{MUTED}; font-size:11px; line-height:1.6;">
            Rwanda Football Federation — Finance Department<br/>
            Kigali, Rwanda · This is an automated message, please don't reply directly.
          </p>
        </div>

      </div>
    </div>
    """


def invite_email_html(name_hint: str, code: str, role: str) -> str:
    role_label = {"staff": "Department Staff", "daf": "Director of Finance", "sg": "Secretary General"}.get(role, role)
    inner = f"""
      <h2 style="margin:0 0 12px; color:{INK}; font-size:20px; font-weight:600;">You've been invited</h2>
      <p style="margin:0 0 20px; color:{MUTED}; font-size:14px; line-height:1.6;">
        You've been invited to join FERWAFA Approvals as <b style="color:{INK};">{role_label}</b>.
        Use the code below to create your account.
      </p>
      <div style="background:{SURFACE}; border:1px dashed {BORDER}; border-radius:10px; padding:18px; text-align:center; margin:0 0 20px;">
        <span style="font-family:'Courier New', monospace; font-size:24px; letter-spacing:6px; font-weight:700; color:{BLUE};">{code}</span>
      </div>
      <p style="margin:0; color:{MUTED}; font-size:12px; line-height:1.6;">
        This code expires in 48 hours and can only be used once. If you weren't expecting this invitation, you can safely ignore this email.
      </p>
    """
    return _email_shell(inner)


def verification_email_html(link: str) -> str:
    inner = f"""
      <h2 style="margin:0 0 12px; color:{INK}; font-size:20px; font-weight:600;">Confirm your email</h2>
      <p style="margin:0 0 24px; color:{MUTED}; font-size:14px; line-height:1.6;">
        One more step — click below to confirm your email and activate your FERWAFA Approvals account.
      </p>
      <div style="text-align:center; margin:0 0 20px;">
        <a href="{link}" style="display:inline-block; background:{BLUE}; color:#ffffff; padding:13px 28px; border-radius:8px; text-decoration:none; font-size:14px; font-weight:600;">
          Verify email address
        </a>
      </div>
      <p style="margin:0; color:{MUTED}; font-size:12px; line-height:1.6;">
        This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.
      </p>
    """
    return _email_shell(inner)


def password_reset_email_html(link: str) -> str:
    inner = f"""
      <h2 style="margin:0 0 12px; color:{INK}; font-size:20px; font-weight:600;">Reset your password</h2>
      <p style="margin:0 0 24px; color:{MUTED}; font-size:14px; line-height:1.6;">
        We received a request to reset your password. Click below to choose a new one.
      </p>
      <div style="text-align:center; margin:0 0 20px;">
        <a href="{link}" style="display:inline-block; background:{BLUE}; color:#ffffff; padding:13px 28px; border-radius:8px; text-decoration:none; font-size:14px; font-weight:600;">
          Reset password
        </a>
      </div>
      <p style="margin:0; color:{MUTED}; font-size:12px; line-height:1.6;">
        This link expires in 30 minutes. If you didn't request this, you can safely ignore this email — your password will remain unchanged.
      </p>
    """
    return _email_shell(inner)


def approval_notification_html(request_title: str, decision: str, stage: str, comment: str | None = None) -> str:
    """Sent to the requester whenever DAF or SG approves/rejects — ties
    directly into the 'notified at every stage' requirement."""
    is_approved = decision == "approved"
    color = "#1A7A4C" if is_approved else "#C1454C"
    label = "Approved" if is_approved else "Rejected"

    comment_block = f"""
      <div style="background:{SURFACE}; border-left:3px solid {color}; border-radius:6px; padding:14px 16px; margin:16px 0;">
        <p style="margin:0; color:{INK}; font-size:13px; line-height:1.6; font-style:italic;">"{comment}"</p>
      </div>
    """ if comment else ""

    inner = f"""
      <div style="display:inline-block; background:{color}1a; color:{color}; font-size:12px; font-weight:600; padding:4px 12px; border-radius:20px; margin-bottom:14px;">
        {label} by {stage}
      </div>
      <h2 style="margin:0 0 12px; color:{INK}; font-size:20px; font-weight:600;">{request_title}</h2>
      <p style="margin:0 0 8px; color:{MUTED}; font-size:14px; line-height:1.6;">
        Your request has been <b style="color:{color};">{label.lower()}</b> at the {stage} stage.
      </p>
      {comment_block}
      <div style="text-align:center; margin:20px 0 0;">
        <a href="{settings.frontend_url}/login" style="display:inline-block; background:{BLUE}; color:#ffffff; padding:12px 24px; border-radius:8px; text-decoration:none; font-size:14px; font-weight:600;">
          View request
        </a>
      </div>
    """
    return _email_shell(inner)