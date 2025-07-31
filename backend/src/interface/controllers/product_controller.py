from fastapi import HTTPException, Depends, Query
from databases import Database
from src.application.usecases.products import (
    CreateProductUseCase, 
    GetProductsUseCase, 
    UpdateProductQuantityUseCase
)
from src.infrastructure.repositories import SQLAlchemyProductRepository
from src.infrastructure.database.connection import get_database
from src.interface.schemas.product_schemas import (
    ProductCreateRequest,
    UpdateQuantityRequest,
    StandardResponse,
    ProductResponse
)
from typing import List


class ProductController:
    def __init__(self):
        pass

    async def create_product(
        self, 
        request: ProductCreateRequest, 
        database: Database = Depends(get_database)
    ) -> StandardResponse:
        try:
            product_repository = SQLAlchemyProductRepository(database)
            create_usecase = CreateProductUseCase(product_repository)
            
            product_data = await create_usecase.execute(request.dict())
            
            return StandardResponse(
                success=True,
                message="Product created successfully",
                data=product_data
            )
        except ValueError as e:
            if "already exists" in str(e):
                raise HTTPException(status_code=409, detail=str(e))
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail="Internal server error")

    async def get_products(
        self,
        page: int = Query(1, ge=1, description="Page number"),
        limit: int = Query(10, ge=1, le=100, description="Items per page"),
        database: Database = Depends(get_database)
    ) -> StandardResponse:
        try:
            product_repository = SQLAlchemyProductRepository(database)
            get_usecase = GetProductsUseCase(product_repository)
            
            products = await get_usecase.execute({"page": page, "limit": limit})
            
            return StandardResponse(
                success=True,
                message="Products retrieved successfully",
                data={"products": products, "page": page, "limit": limit}
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail="Internal server error")

    async def update_product_quantity(
        self,
        product_id: int,
        request: UpdateQuantityRequest,
        database: Database = Depends(get_database)
    ) -> StandardResponse:
        try:
            product_repository = SQLAlchemyProductRepository(database)
            update_usecase = UpdateProductQuantityUseCase(product_repository)
            
            updated_product = await update_usecase.execute(product_id, request.quantity)
            
            return StandardResponse(
                success=True,
                message="Product quantity updated successfully",
                data=updated_product
            )
        except ValueError as e:
            if "not found" in str(e):
                raise HTTPException(status_code=404, detail=str(e))
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail="Internal server error") 