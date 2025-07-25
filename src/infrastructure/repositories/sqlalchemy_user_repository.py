from typing import Optional
from databases import Database
from src.domain.entities.user import User
from src.domain.repositories.user_repository import UserRepository
from src.infrastructure.database.models.user import UserModel


class SQLAlchemyUserRepository(UserRepository):
    def __init__(self, database: Database):
        self.database = database

    async def find_by_username(self, username: str) -> Optional[User]:
        try:
            query = """
                SELECT id, username, password_hash, created_at, updated_at 
                FROM users WHERE username = :username
            """
            result = await self.database.fetch_one(
                query=query, values={"username": username}
            )
            
            if not result:
                return None

            return User(
                id=result["id"],
                username=result["username"],
                password_hash=result["password_hash"],
                created_at=result["created_at"],
                updated_at=result["updated_at"]
            )
        except Exception as e:
            raise Exception(f"Error finding user by username: {str(e)}")

    async def find_by_id(self, id: int) -> Optional[User]:
        try:
            query = """
                SELECT id, username, password_hash, created_at, updated_at 
                FROM users WHERE id = :id
            """
            result = await self.database.fetch_one(
                query=query, values={"id": id}
            )
            
            if not result:
                return None

            return User(
                id=result["id"],
                username=result["username"],
                password_hash=result["password_hash"],
                created_at=result["created_at"],
                updated_at=result["updated_at"]
            )
        except Exception as e:
            raise Exception(f"Error finding user by ID: {str(e)}")

    async def create(self, user: User) -> User:
        try:
            query = """
                INSERT INTO users (username, password_hash, created_at, updated_at)
                VALUES (:username, :password_hash, :created_at, :updated_at)
                RETURNING id, username, password_hash, created_at, updated_at
            """
            result = await self.database.fetch_one(
                query=query,
                values={
                    "username": user.username,
                    "password_hash": user.password_hash,
                    "created_at": user.created_at,
                    "updated_at": user.updated_at
                }
            )

            return User(
                id=result["id"],
                username=result["username"],
                password_hash=result["password_hash"],
                created_at=result["created_at"],
                updated_at=result["updated_at"]
            )
        except Exception as e:
            raise Exception(f"Error creating user: {str(e)}")

    async def update(self, user: User) -> User:
        try:
            # First check if user exists
            existing = await self.find_by_id(user.id)
            if not existing:
                raise Exception("User not found")

            query = """
                UPDATE users 
                SET username = :username, password_hash = :password_hash, updated_at = :updated_at
                WHERE id = :id
                RETURNING id, username, password_hash, created_at, updated_at
            """
            result = await self.database.fetch_one(
                query=query,
                values={
                    "id": user.id,
                    "username": user.username,
                    "password_hash": user.password_hash,
                    "updated_at": user.updated_at
                }
            )

            return User(
                id=result["id"],
                username=result["username"],
                password_hash=result["password_hash"],
                created_at=result["created_at"],
                updated_at=result["updated_at"]
            )
        except Exception as e:
            raise Exception(f"Error updating user: {str(e)}")

    async def delete(self, id: int) -> bool:
        try:
            # First check if user exists
            existing = await self.find_by_id(id)
            if not existing:
                raise Exception("User not found")

            query = "DELETE FROM users WHERE id = :id"
            await self.database.execute(query=query, values={"id": id})
            return True
        except Exception as e:
            raise Exception(f"Error deleting user: {str(e)}") 