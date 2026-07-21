from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# check_same_thread=False is required for SQLite when used with FastAPI's
# threaded request handling — SQLite itself is still single-writer, so this
# is safe for our access patterns but is exactly why we flagged earlier
# that Postgres is the right call once this goes to real production load.
connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}

engine = create_engine(settings.database_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()