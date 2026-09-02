from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash


SECRET_KEY = "smart-health-queue-development-secret-key-2026"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 30


password_hash = PasswordHash.recommended()


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire
    })

    token = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


def decode_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except jwt.ExpiredSignatureError:
        return None

    except jwt.InvalidTokenError:
        return None