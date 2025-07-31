from fastapi import APIRouter, Depends, Query
from databases import Database
from src.interface.controllers.product_controller import ProductController
from src.interface.schemas.product_schemas import (
    ProductCreateRequest,
    UpdateQuantityRequest,
    StandardResponse
)
from src.interface.middleware.auth_middleware import get_current_user
from src.infrastructure.database.connection import get_database
from src.domain.entities.user import User

products_router = APIRouter()
product_controller = ProductController()


@products_router.post("/", response_model=StandardResponse, status_code=201)
async def create_product(
    request: ProductCreateRequest,
    database: Database = Depends(get_database),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new product (Authentication required)
    
    - **name**: Product name
    - **type**: Product type/category
    - **sku**: Product SKU (must be unique)
    - **imageUrl**: Optional product image URL
    - **description**: Optional product description
    - **quantity**: Product quantity (must be non-negative)
    - **price**: Product price (must be non-negative)
    """
    return await product_controller.create_product(request, database)


@products_router.get("/", response_model=StandardResponse)
async def get_products(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    database: Database = Depends(get_database),
    current_user: User = Depends(get_current_user)
):
    """
    Get all products with pagination (Authentication required)
    
    - **page**: Page number (default: 1)
    - **limit**: Items per page (default: 10, max: 100)
    """
    return await product_controller.get_products(page, limit, database)


@products_router.put("/{product_id}/quantity", response_model=StandardResponse)
async def update_product_quantity(
    product_id: int,
    request: UpdateQuantityRequest,
    database: Database = Depends(get_database),
    current_user: User = Depends(get_current_user)
):
    """
    Update product quantity (Authentication required)
    
    - **product_id**: ID of the product to update
    - **quantity**: New quantity (must be non-negative)
    """
    return await product_controller.update_product_quantity(product_id, request, database) 