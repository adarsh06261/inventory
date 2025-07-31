from decimal import Decimal
from typing import Dict, Any, Optional
from src.domain.entities.product import Product
from src.domain.repositories.product_repository import ProductRepository


class CreateProductUseCase:
    def __init__(self, product_repository: ProductRepository):
        self.product_repository = product_repository

    async def execute(self, product_data: Dict[str, Any]) -> dict:
        name = product_data.get("name")
        type_ = product_data.get("type")
        sku = product_data.get("sku")
        image_url = product_data.get("imageUrl")
        description = product_data.get("description")
        quantity = product_data.get("quantity")
        price = product_data.get("price")

        # Validate required fields
        if not all([name, type_, sku, quantity is not None, price is not None]):
            raise ValueError("Name, type, SKU, quantity, and price are required")

        # Validate data types and constraints
        if not isinstance(quantity, int) or quantity < 0:
            raise ValueError("Quantity must be a non-negative number")

        if not isinstance(price, (int, float, Decimal)) or price < 0:
            raise ValueError("Price must be a non-negative number")

        if len(sku) < 3:
            raise ValueError("SKU must be at least 3 characters long")

        # Check if SKU already exists
        existing_product = await self.product_repository.find_by_sku(sku)
        if existing_product:
            raise ValueError("Product with this SKU already exists")

        # Create product
        product = Product.create(
            name=name,
            type=type_,
            sku=sku,
            image_url=image_url,
            description=description,
            quantity=quantity,
            price=Decimal(str(price))
        )
        saved_product = await self.product_repository.create(product)

        return saved_product.to_dict() 