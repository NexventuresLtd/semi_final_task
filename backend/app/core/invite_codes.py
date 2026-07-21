import secrets
import string
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Excludes visually ambiguous characters (0/O, 1/l/I) since staff will be
# typing this by hand from an email.
ALPHABET = "".join(c for c in string.ascii_uppercase + string.digits if c not in "01OIL")


def generate_invite_code(length: int = 9) -> str:
    return "".join(secrets.choice(ALPHABET) for _ in range(length))


def hash_code(code: str) -> str:
    return pwd_context.hash(code.upper())


def verify_code(code: str, code_hash: str) -> bool:
    return pwd_context.verify(code.upper(), code_hash)