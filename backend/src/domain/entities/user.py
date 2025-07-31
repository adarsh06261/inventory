from datetime import datetime
from typing import Optional


class User:
    def __init__(
        self,
        id: Optional[int],
        username: str,
        password_hash: str,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self.id = id
        self.username = username
        self.password_hash = password_hash
        self.created_at = created_at or datetime.now()
        self.updated_at = updated_at or datetime.now()

    @classmethod
    def create(cls, username: str, password_hash: str) -> 'User':
        """Create a new User instance"""
        return cls(
            id=None,
            username=username,
            password_hash=password_hash,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

    def to_dict(self) -> dict:
        """Convert User to dictionary for JSON serialization"""
        return {
            "id": self.id,
            "username": self.username,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        } 