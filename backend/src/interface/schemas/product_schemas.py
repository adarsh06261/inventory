from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class ProductCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Product name")
    type: str = Field(..., min_length=1, max_length=50, description="Product type")
    sku: str = Field(..., min_length=3, max_length=50, description="Product SKU")
    imageUrl: Optional[str] = Field(None, max_length=500, description="Product image URL")
    description: Optional[str] = Field(None, description="Product description")
    quantity: int = Field(..., ge=0, description="Product quantity")
    price: Decimal = Field(..., ge=0, description="Product price")


class ProductResponse(BaseModel):
    id: int
    name: str
    type: str
    sku: str
    image_url: Optional[str]
    description: Optional[str]
    quantity: int
    price: float
    created_at: datetime
    updated_at: datetime


class UpdateQuantityRequest(BaseModel):
    quantity: int = Field(..., ge=0, description="New quantity")


class ProductListResponse(BaseModel):
    success: bool
    message: str
    data: List[ProductResponse]


class StandardResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None 