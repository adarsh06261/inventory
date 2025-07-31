from abc import ABC, abstractmethod
from typing import Optional, List
from src.domain.entities.product import Product


class ProductRepository(ABC):
    """Abstract base class for product repository operations"""

    @abstractmethod
    async def find_by_id(self, id: int) -> Optional[Product]:
        """Find product by ID"""
        pass

    @abstractmethod
    async def find_by_sku(self, sku: str) -> Optional[Product]:
        """Find product by SKU"""
        pass

    @abstractmethod
    async def find_all(self, limit: int = 10, offset: int = 0) -> List[Product]:
        """Find all products with pagination"""
        pass

    @abstractmethod
    async def create(self, product: Product) -> Product:
        """Create a new product"""
        pass

    @abstractmethod
    async def update(self, product: Product) -> Product:
        """Update an existing product"""
        pass

    @abstractmethod
    async def delete(self, id: int) -> bool:
        """Delete a product by ID"""
        pass

    @abstractmethod
    async def count(self) -> int:
        """Count total number of products"""
        pass 