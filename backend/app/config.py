from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    app_env: str = "development"
    app_secret_key: str
    frontend_url: str = "http://localhost:5173"

    # Database
    database_url: str = "sqlite:///./ferwafa.db"

    # JWT
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    # Field-level encryption
    field_encryption_key: str

    # Email
    email_smtp_server: str
    email_smtp_port: int = 587
    email_sender_email: str
    email_sender_password: str
    email_login: str

    # Google OAuth
    google_client_id: str = ""

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # Seed SG account
    seed_sg_name: str = "Secretary General"
    seed_sg_email: str = "sg@ferwafa.rw"
    seed_sg_password: str = "sg-ferwafa!"

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()