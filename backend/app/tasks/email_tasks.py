import asyncio
from app.tasks.celery_app import celery_app
from app.services.email_service import send_email


@celery_app.task(name="send_email_task", max_retries=3, default_retry_delay=30)
def send_email_task(to_email: str, subject: str, html_body: str):
    # aiosmtplib is async; Celery workers run sync, so we bridge here.
    asyncio.run(send_email(to_email, subject, html_body))