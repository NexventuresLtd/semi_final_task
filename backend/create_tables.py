"""
One-shot script to create any missing tables without touching existing data.
Safe to run multiple times — create_all is idempotent.
"""
import sqlite3
from app.database import engine, Base

# Import every model so SQLAlchemy registers them all with Base.metadata
from app.models import user, invite, template, request, comment, audit_log, session  # noqa

# create_all only creates tables that don't already exist
Base.metadata.create_all(bind=engine)
print("All tables ensured. Current tables in ferwafa.db:")

conn = sqlite3.connect("ferwafa.db")
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
tables = cursor.fetchall()
for t in tables:
    print(" -", t[0])
conn.close()
