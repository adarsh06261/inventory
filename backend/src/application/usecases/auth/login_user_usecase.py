import os
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt
from src.domain.repositories.user_repository import UserRepository

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class LoginUserUseCase:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def execute(self, username: str, password: str) -> dict:
        # Validate input
        if not username or not password:
            raise ValueError("Username and password are required")

        # Find user by username
        user = await self.user_repository.find_by_username(username)
        if not user:
            raise ValueError("Invalid credentials")

        # Verify password
        if not pwd_context.verify(password, user.password_hash):
            raise ValueError("Invalid credentials")

        # Generate JWT token
        expires_in = os.getenv("JWT_EXPIRES_IN", "24h")
        if expires_in.endswith("h"):
            hours = int(expires_in[:-1])
            expire = datetime.utcnow() + timedelta(hours=hours)
        else:
            expire = datetime.utcnow() + timedelta(hours=24)

        token_data = {
            "sub": str(user.id),
            "username": user.username,
            "exp": expire
        }

        secret_key = os.getenv("JWT_SECRET")
        if not secret_key:
            raise ValueError("JWT_SECRET environment variable is not set")

        token = jwt.encode(token_data, secret_key, algorithm="HS256")

        return {
            "token": token,
            "user": user.to_dict(),
        } 