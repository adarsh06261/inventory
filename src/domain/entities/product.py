from datetime import datetime
from typing import Optional
from decimal import Decimal


class Product:
    def __init__(
        self,
        id: Optional[int],
        name: str,
        type: str,
        sku: str,
        image_url: Optional[str],
        description: Optional[str],
        quantity: int,
        price: Decimal,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self.id = id
        self.name = name
        self.type = type
        self.sku = sku
        self.image_url = image_url
        self.description = description
        self.quantity = quantity
        self.price = price
        self.created_at = created_at or datetime.now()
        self.updated_at = updated_at or datetime.now()

    @classmethod
    def create(
        cls,
        name: str,
        type: str,
        sku: str,
        image_url: Optional[str],
        description: Optional[str],
        quantity: int,
        price: Decimal
    ) -> 'Product':
        """Create a new Product instance"""
        return cls(
            id=None,
            name=name,
            type=type,
            sku=sku,
            image_url=image_url,
            description=description,
            quantity=quantity,
            price=price,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

    def update_quantity(self, new_quantity: int) -> None:
        """Update product quantity with validation"""
        if new_quantity < 0:
            raise ValueError("Quantity cannot be negative")
        self.quantity = new_quantity
        self.updated_at = datetime.now()

    def to_dict(self) -> dict:
        """Convert Product to dictionary for JSON serialization"""
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "sku": self.sku,
            "image_url": self.image_url,
            "description": self.description,
            "quantity": self.quantity,
            "price": float(self.price),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        } 