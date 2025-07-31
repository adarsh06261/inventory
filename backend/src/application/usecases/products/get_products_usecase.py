from typing import Dict, Any, List
from src.domain.repositories.product_repository import ProductRepository


class GetProductsUseCase:
    def __init__(self, product_repository: ProductRepository):
        self.product_repository = product_repository

    async def execute(self, options: Dict[str, Any] = None) -> List[dict]:
        if options is None:
            options = {}

        page = options.get("page", 1)
        limit = options.get("limit", 10)

        # Validate pagination parameters
        if page < 1:
            raise ValueError("Page must be a positive number")

        if limit < 1 or limit > 100:
            raise ValueError("Limit must be between 1 and 100")

        offset = (page - 1) * limit
        products = await self.product_repository.find_all(limit=limit, offset=offset)

        return [product.to_dict() for product in products] 