from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class PurchaseBase(BaseModel):
    quantity: int = Field(..., gt=0, le=100)

class PurchaseCreate(PurchaseBase):
    sweet_id: int

class PurchaseResponse(BaseModel):
    id: int
    user_id: int
    sweet_id: int
    quantity: int
    unit_price: float
    total_price: float
    status: str
    created_at: datetime
    sweet_name: Optional[str] = None
    user_email: Optional[str] = None

    class Config:
        from_attributes = True