
from app.database import SessionLocal
from app.models.referee import RefereeContact
db = SessionLocal()
for c in db.query(RefereeContact).all():
    print(c.full_name, c.qualification_badge)
