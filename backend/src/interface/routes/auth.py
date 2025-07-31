from fastapi import APIRouter, Depends
from databases import Database
from src.interface.controllers.auth_controller import AuthController
from src.interface.schemas.auth_schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    StandardResponse
)
from src.infrastructure.database.connection import get_database

auth_router = APIRouter()
auth_controller = AuthController()


@auth_router.post("/register", response_model=StandardResponse, status_code=201)
async def register(
    request: UserRegisterRequest,
    database: Database = Depends(get_database)
):
    """
    Register a new user
    
    - **username**: Username must be between 3 and 50 characters
    - **password**: Password must be at least 6 characters long
    """
    return await auth_controller.register(request, database)


@auth_router.post("/login", response_model=StandardResponse)
async def login(
    request: UserLoginRequest,
    database: Database = Depends(get_database)
):
    """
    Login user and get JWT token
    
    - **username**: User's username
    - **password**: User's password
    """
    return await auth_controller.login(request, database) 