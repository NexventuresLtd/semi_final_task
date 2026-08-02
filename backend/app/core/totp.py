import pyotp

def generate_totp_secret() -> str:
    return pyotp.random_base32()


def get_totp_uri(secret: str, user_email: str) -> str:
    return pyotp.totp.TOTP(secret).provisioning_uri(
        name=user_email,
        issuer_name="FERWAFA Approvals",
    )


def verify_totp_code(secret: str, code: str) -> bool:
    totp = pyotp.TOTP(secret)
    # valid_window=2 tolerates ±60s clock drift between server and phone —
    # increased from 1 to handle phones that haven't synced their clock recently.
    return totp.verify(code, valid_window=2)