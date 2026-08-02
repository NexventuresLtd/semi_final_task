import threading
import asyncio
from fastapi import FastAPI
import logging
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, admin, users, templates, requests, approvals, activity, referee, analytics
from app.routers import notifications
from app.routers import ws

logger = logging.getLogger("uvicorn.error")
is_production = settings.app_env.lower() == "production"
app = FastAPI(
    title="FERWAFA Approvals API",
    docs_url=None if is_production else "/docs",
    redoc_url=None if is_production else "/redoc",
    openapi_url=None if is_production else "/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],  # only our own frontend, never "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def start_celery_worker():
    logger.info("Starting Celery worker thread...")
    try:
        from app.tasks.celery_app import celery_app
        worker = celery_app.Worker(loglevel="info", pool="solo")
        logger.info("Celery worker object created, calling .start()...")
        worker.start()
    except Exception:
        logger.exception("Celery worker thread crashed on startup")


@app.on_event("startup")
async def on_startup():
    # Capture the running uvicorn event loop so sync route handlers can
    # schedule WebSocket pushes onto it via run_coroutine_threadsafe.
    from app.core import ws_loop
    ws_loop.loop = asyncio.get_running_loop()

    logger.info(f"APP_ENV is: {settings.app_env}")
    if is_production:
        logger.info("Production mode — launching Celery worker thread")
        thread = threading.Thread(target=start_celery_worker, daemon=True)
        thread.start()
    else:
        logger.info("Not production — skipping Celery worker thread")


@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(auth.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(templates.router, prefix="/api")
app.include_router(requests.router, prefix="/api")
app.include_router(approvals.router, prefix="/api")
app.include_router(activity.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(ws.router, prefix="/api")
app.include_router(referee.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")