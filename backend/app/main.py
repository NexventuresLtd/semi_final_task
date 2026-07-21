from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, admin, users, templates, requests, approvals, activity

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
