from src.domain.repositories.product_repository import ProductRepository


class UpdateProductQuantityUseCase:
    def __init__(self, product_repository: ProductRepository):
        self.product_repository = product_repository

    async def execute(self, id: int, quantity: int) -> dict:
        # Validate input
        if not id:
            raise ValueError("Product ID is required")

        if not isinstance(quantity, int) or quantity < 0:
            raise ValueError("Quantity must be a non-negative number")

        # Find product
        product = await self.product_repository.find_by_id(id)
        if not product:
            raise ValueError("Product not found")

        # Update quantity
        product.update_quantity(quantity)
        updated_product = await self.product_repository.update(product)

        return updated_product.to_dict() 