from .user import UserModel
from .product import ProductModel

# Use the same Base from connection.py to avoid conflicts
from src.infrastructure.database.connection import Base

__all__ = ["Base", "UserModel", "ProductModel"] 