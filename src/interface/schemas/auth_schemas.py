from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UserRegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Username must be between 3 and 50 characters")
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters long")


class UserLoginRequest(BaseModel):
    username: str = Field(..., description="Username")
    password: str = Field(..., description="Password")


class UserResponse(BaseModel):
    id: int
    username: str
    created_at: datetime
    updated_at: datetime


class LoginResponse(BaseModel):
    token: str
    user: UserResponse


class StandardResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None 