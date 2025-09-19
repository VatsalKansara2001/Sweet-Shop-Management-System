from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SweetBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=1, max_length=50)
    price: float = Field(..., gt=0, le=1000)
    quantity: int = Field(..., ge=0)
    description: Optional[str] = Field(None, max_length=1000)
    image_url: Optional[str] = Field(None, max_length=500)

class SweetCreate(SweetBase):
    pass

class SweetUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    price: Optional[float] = Field(None, gt=0, le=1000)
    quantity: Optional[int] = Field(None, ge=0)
    description: Optional[str] = Field(None, max_length=1000)
    image_url: Optional[str] = Field(None, max_length=500)
    is_available: Optional[bool] = None

class SweetResponse(SweetBase):
    id: int
    is_available: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_in_stock: bool

    class Config:
        from_attributes = True
