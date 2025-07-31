from fastapi import HTTPException, Depends
from databases import Database
from src.application.usecases.auth import RegisterUserUseCase, LoginUserUseCase
from src.infrastructure.repositories import SQLAlchemyUserRepository
from src.infrastructure.database.connection import get_database
from src.interface.schemas.auth_schemas import (
    UserRegisterRequest, 
    UserLoginRequest, 
    StandardResponse,
    LoginResponse,
    UserResponse
)


class AuthController:
    def __init__(self):
        pass

    async def register(
        self, 
        request: UserRegisterRequest, 
        database: Database = Depends(get_database)
    ) -> StandardResponse:
        try:
            user_repository = SQLAlchemyUserRepository(database)
            register_usecase = RegisterUserUseCase(user_repository)
            
            user_data = await register_usecase.execute(
                request.username, 
                request.password
            )
            
            return StandardResponse(
                success=True,
                message="User registered successfully",
                data=user_data
            )
        except ValueError as e:
            if "already exists" in str(e):
                raise HTTPException(status_code=409, detail=str(e))
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail="Internal server error")

    async def login(
        self, 
        request: UserLoginRequest, 
        database: Database = Depends(get_database)
    ) -> StandardResponse:
        try:
            user_repository = SQLAlchemyUserRepository(database)
            login_usecase = LoginUserUseCase(user_repository)
            
            result = await login_usecase.execute(
                request.username, 
                request.password
            )
            
            return StandardResponse(
                success=True,
                message="Login successful",
                data=result
            )
        except ValueError as e:
            if "Invalid credentials" in str(e):
                raise HTTPException(status_code=401, detail=str(e))
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail="Internal server error") 