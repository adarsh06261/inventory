from sqlalchemy import Column, Integer, String, Text, DateTime, Numeric, func
from src.infrastructure.database.connection import Base


class ProductModel(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)
    sku = Column(String(50), unique=True, nullable=False, index=True)
    image_url = Column("image_url", String(500), nullable=True)
    description = Column(Text, nullable=True)
    quantity = Column(Integer, nullable=False, default=0)
    price = Column(Numeric(10, 2), nullable=False)
    created_at = Column("created_at", DateTime, default=func.now(), nullable=False)
    updated_at = Column("updated_at", DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<Product(id={self.id}, name='{self.name}', sku='{self.sku}')>" 