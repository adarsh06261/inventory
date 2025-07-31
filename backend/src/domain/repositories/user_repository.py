from abc import ABC, abstractmethod
from typing import Optional
from src.domain.entities.user import User


class UserRepository(ABC):
    """Abstract base class for user repository operations"""

    @abstractmethod
    async def find_by_username(self, username: str) -> Optional[User]:
        """Find user by username"""
        pass

    @abstractmethod
    async def find_by_id(self, id: int) -> Optional[User]:
        """Find user by ID"""
        pass

    @abstractmethod
    async def create(self, user: User) -> User:
        """Create a new user"""
        pass

    @abstractmethod
    async def update(self, user: User) -> User:
        """Update an existing user"""
        pass

    @abstractmethod
    async def delete(self, id: int) -> bool:
        """Delete a user by ID"""
        pass 