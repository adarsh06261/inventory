import os
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt
from src.domain.entities.user import User
from src.domain.repositories.user_repository import UserRepository

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class RegisterUserUseCase:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def execute(self, username: str, password: str) -> dict:
        # Validate input
        if not username or not password:
            raise ValueError("Username and password are required")

        if len(username) < 3:
            raise ValueError("Username must be at least 3 characters long")

        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters long")

        # Check if user already exists
        existing_user = await self.user_repository.find_by_username(username)
        if existing_user:
            raise ValueError("Username already exists")

        # Hash password
        password_hash = pwd_context.hash(password)

        # Create user
        user = User.create(username, password_hash)
        saved_user = await self.user_repository.create(user)

        # Generate JWT token (same as login)
        expires_in = os.getenv("JWT_EXPIRES_IN", "24h")
        if expires_in.endswith("h"):
            hours = int(expires_in[:-1])
            expire = datetime.utcnow() + timedelta(hours=hours)
        else:
            expire = datetime.utcnow() + timedelta(hours=24)

        token_data = {
            "sub": str(saved_user.id),
            "username": saved_user.username,
            "exp": expire
        }

        secret_key = os.getenv("JWT_SECRET")
        if not secret_key:
            raise ValueError("JWT_SECRET environment variable is not set")

        token = jwt.encode(token_data, secret_key, algorithm="HS256")

        return {
            "token": token,
            "user": saved_user.to_dict(),
        } 