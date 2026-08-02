from app.database import SessionLocal
from app.models.user import User
db = SessionLocal()
sg = db.query(User).filter(User.email == 'sg@ferwafa.rw').first()
sg.totp_secret = None
sg.totp_enabled = False
db.commit()
print('Local TOTP reset done')
