from app.database import Base
from app.models import user, invite, template, request, comment, audit_log, session  # noqa

target_metadata = Base.metadata