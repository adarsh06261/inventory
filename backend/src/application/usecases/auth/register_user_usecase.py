from passlib.context import CryptContext
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

        return saved_user.to_dict() 