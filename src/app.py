from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

from src.infrastructure.database.connection import database, engine
from src.infrastructure.database.models import Base
from src.interface.routes.auth import auth_router
from src.interface.routes.products import products_router
from src.interface.middleware.error_handler import http_exception_handler, general_exception_handler, validation_exception_handler
from fastapi.exceptions import RequestValidationError

# Load environment variables
load_dotenv()

def create_app() -> FastAPI:
    app = FastAPI(
        title="Inventory Management API",
        description="A complete inventory management backend API with authentication and product management",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc"
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Configure appropriately for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Database initialization
    @app.on_event("startup")
    async def startup():
        # Create tables if they don't exist
        if os.getenv("NODE_ENV") == "development":
            Base.metadata.create_all(bind=engine)
        await database.connect()

    @app.on_event("shutdown")
    async def shutdown():
        await database.disconnect()

    # Include routers
    app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
    app.include_router(products_router, prefix="/products", tags=["Products"])

    # Health check endpoint
    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "message": "API is running"}

    # Exception handlers
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)

    return app 