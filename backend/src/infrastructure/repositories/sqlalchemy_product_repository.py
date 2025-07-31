from typing import Optional, List
from decimal import Decimal
from databases import Database
from src.domain.entities.product import Product
from src.domain.repositories.product_repository import ProductRepository


class SQLAlchemyProductRepository(ProductRepository):
    def __init__(self, database: Database):
        self.database = database

    async def find_by_id(self, id: int) -> Optional[Product]:
        try:
            query = """
                SELECT id, name, type, sku, image_url, description, quantity, price, created_at, updated_at 
                FROM products WHERE id = :id
            """
            result = await self.database.fetch_one(
                query=query, values={"id": id}
            )
            
            if not result:
                return None

            return Product(
                id=result["id"],
                name=result["name"],
                type=result["type"],
                sku=result["sku"],
                image_url=result["image_url"],
                description=result["description"],
                quantity=result["quantity"],
                price=Decimal(str(result["price"])),
                created_at=result["created_at"],
                updated_at=result["updated_at"]
            )
        except Exception as e:
            raise Exception(f"Error finding product by ID: {str(e)}")

    async def find_by_sku(self, sku: str) -> Optional[Product]:
        try:
            query = """
                SELECT id, name, type, sku, image_url, description, quantity, price, created_at, updated_at 
                FROM products WHERE sku = :sku
            """
            result = await self.database.fetch_one(
                query=query, values={"sku": sku}
            )
            
            if not result:
                return None

            return Product(
                id=result["id"],
                name=result["name"],
                type=result["type"],
                sku=result["sku"],
                image_url=result["image_url"],
                description=result["description"],
                quantity=result["quantity"],
                price=Decimal(str(result["price"])),
                created_at=result["created_at"],
                updated_at=result["updated_at"]
            )
        except Exception as e:
            raise Exception(f"Error finding product by SKU: {str(e)}")

    async def find_all(self, limit: int = 10, offset: int = 0) -> List[Product]:
        try:
            query = """
                SELECT id, name, type, sku, image_url, description, quantity, price, created_at, updated_at 
                FROM products 
                ORDER BY created_at DESC
                LIMIT :limit OFFSET :offset
            """
            results = await self.database.fetch_all(
                query=query, values={"limit": limit, "offset": offset}
            )
            
            products = []
            for result in results:
                product = Product(
                    id=result["id"],
                    name=result["name"],
                    type=result["type"],
                    sku=result["sku"],
                    image_url=result["image_url"],
                    description=result["description"],
                    quantity=result["quantity"],
                    price=Decimal(str(result["price"])),
                    created_at=result["created_at"],
                    updated_at=result["updated_at"]
                )
                products.append(product)
                
            return products
        except Exception as e:
            raise Exception(f"Error finding all products: {str(e)}")

    async def create(self, product: Product) -> Product:
        try:
            query = """
                INSERT INTO products (name, type, sku, image_url, description, quantity, price, created_at, updated_at)
                VALUES (:name, :type, :sku, :image_url, :description, :quantity, :price, :created_at, :updated_at)
                RETURNING id, name, type, sku, image_url, description, quantity, price, created_at, updated_at
            """
            result = await self.database.fetch_one(
                query=query,
                values={
                    "name": product.name,
                    "type": product.type,
                    "sku": product.sku,
                    "image_url": product.image_url,
                    "description": product.description,
                    "quantity": product.quantity,
                    "price": product.price,
                    "created_at": product.created_at,
                    "updated_at": product.updated_at
                }
            )

            return Product(
                id=result["id"],
                name=result["name"],
                type=result["type"],
                sku=result["sku"],
                image_url=result["image_url"],
                description=result["description"],
                quantity=result["quantity"],
                price=Decimal(str(result["price"])),
                created_at=result["created_at"],
                updated_at=result["updated_at"]
            )
        except Exception as e:
            raise Exception(f"Error creating product: {str(e)}")

    async def update(self, product: Product) -> Product:
        try:
            # First check if product exists
            existing = await self.find_by_id(product.id)
            if not existing:
                raise Exception("Product not found")

            query = """
                UPDATE products 
                SET name = :name, type = :type, sku = :sku, image_url = :image_url, 
                    description = :description, quantity = :quantity, price = :price, updated_at = :updated_at
                WHERE id = :id
                RETURNING id, name, type, sku, image_url, description, quantity, price, created_at, updated_at
            """
            result = await self.database.fetch_one(
                query=query,
                values={
                    "id": product.id,
                    "name": product.name,
                    "type": product.type,
                    "sku": product.sku,
                    "image_url": product.image_url,
                    "description": product.description,
                    "quantity": product.quantity,
                    "price": product.price,
                    "updated_at": product.updated_at
                }
            )

            return Product(
                id=result["id"],
                name=result["name"],
                type=result["type"],
                sku=result["sku"],
                image_url=result["image_url"],
                description=result["description"],
                quantity=result["quantity"],
                price=Decimal(str(result["price"])),
                created_at=result["created_at"],
                updated_at=result["updated_at"]
            )
        except Exception as e:
            raise Exception(f"Error updating product: {str(e)}")

    async def delete(self, id: int) -> bool:
        try:
            # First check if product exists
            existing = await self.find_by_id(id)
            if not existing:
                raise Exception("Product not found")

            query = "DELETE FROM products WHERE id = :id"
            await self.database.execute(query=query, values={"id": id})
            return True
        except Exception as e:
            raise Exception(f"Error deleting product: {str(e)}")

    async def count(self) -> int:
        try:
            query = "SELECT COUNT(*) as total FROM products"
            result = await self.database.fetch_one(query=query)
            return result["total"]
        except Exception as e:
            raise Exception(f"Error counting products: {str(e)}") 