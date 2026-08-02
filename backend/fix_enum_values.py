from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("ALTER TYPE assignmentstatus ADD VALUE IF NOT EXISTS 'SCHEDULED'"))
    conn.commit()
    print("Added SCHEDULED to assignmentstatus enum")