from app.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()

print('--- qualificationbadge allowed values ---')
rows = db.execute(text("SELECT enumlabel FROM pg_enum WHERE enumtypid = 'qualificationbadge'::regtype ORDER BY enumsortorder")).fetchall()
for r in rows:
    print(r[0])

print('--- assignmentstatus allowed values ---')
rows = db.execute(text("SELECT enumlabel FROM pg_enum WHERE enumtypid = 'assignmentstatus'::regtype ORDER BY enumsortorder")).fetchall()
for r in rows:
    print(r[0])