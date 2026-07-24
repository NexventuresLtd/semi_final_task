
from app.database import SessionLocal
from app.models.user import User
db = SessionLocal()
u = db.query(User).filter(User.email == 'sg@ferwafa.rw').first()
print('signature present:', bool(u.signature_image_encrypted))
print('length:', len(u.signature_image_encrypted or ''))
