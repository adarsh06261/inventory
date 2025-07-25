import os
from typing import Optional
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from databases import Database
from src.infrastructure.repositories import SQLAlchemyUserRepository
from src.infrastructure.database.connection import get_database
from src.domain.entities.user import User

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    database: Database = Depends(get_database)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Get JWT secret
        secret_key = os.getenv("JWT_SECRET")
        if not secret_key:
            raise credentials_exception
        
        # Decode JWT token
        payload = jwt.decode(credentials.credentials, secret_key, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Verify user still exists
    user_repository = SQLAlchemyUserRepository(database)
    user = await user_repository.find_by_id(int(user_id))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user


def require_auth():
    """Dependency for routes that require authentication"""
    return Depends(get_current_user) 