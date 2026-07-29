import threading
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, admin, users, templates, requests, approvals, activity
from app.routers import notifications
from app.routers import ws

is_production = settings.app_env == "production"
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
    """
    Runs the Celery worker inside this same process, in a background
    thread, instead of as a separate deployed service. This avoids
    needing a paid Render Background Worker plan at current scale —
    the tradeoff is that heavy background load would compete with the
    web server for CPU/memory within one instance, which matters far
    less at a single federation's traffic level than it would at
    real scale.
    """
    from app.tasks.celery_app import celery_app
    worker = celery_app.Worker(loglevel="info", pool="solo")
    worker.start()


@app.on_event("startup")
def on_startup():
    if is_production:
        thread = threading.Thread(target=start_celery_worker, daemon=True)
        thread.start()
        

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
