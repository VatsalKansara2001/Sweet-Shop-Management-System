from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.sweet import Sweet
from app.models.user import User
from app.models.purchase import Purchase
from app.schemas.purchase import PurchaseCreate, PurchaseResponse
from app.core.dependencies import get_current_user, get_current_admin_user

router = APIRouter(prefix="/inventory")

@router.post("/purchase", response_model=PurchaseResponse, status_code=status.HTTP_201_CREATED)
def purchase_sweet(
    purchase_data: PurchaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sweet = db.query(Sweet).filter(Sweet.id == purchase_data.sweet_id).first()
    if not sweet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sweet not found"
        )
    
    if not sweet.is_available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sweet is not available for purchase"
        )
    
    if sweet.quantity < purchase_data.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient stock. Only {sweet.quantity} items available"
        )
    
    total_price = sweet.price * purchase_data.quantity
    
    purchase = Purchase(
        user_id=current_user.id,
        sweet_id=sweet.id,
        quantity=purchase_data.quantity,
        unit_price=sweet.price,
        total_price=total_price,
        status="completed"
    )
    
    sweet.quantity -= purchase_data.quantity
    
    db.add(purchase)
    db.commit()
    db.refresh(purchase)
    
    purchase.sweet_name = sweet.name
    purchase.user_email = current_user.email
    
    return purchase

@router.post("/restock/{sweet_id}", status_code=status.HTTP_200_OK)
def restock_sweet(
    sweet_id: int,
    quantity: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    if quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Restock quantity must be positive"
        )
    
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    if not sweet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sweet not found"
        )
    
    old_quantity = sweet.quantity
    sweet.quantity += quantity
    
    db.commit()
    db.refresh(sweet)
    
    return {
        "message": f"Sweet '{sweet.name}' restocked successfully",
        "old_quantity": old_quantity,
        "new_quantity": sweet.quantity,
        "added_quantity": quantity
    }

@router.get("/purchases/my", response_model=List[PurchaseResponse])
def get_my_purchases(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    purchases = db.query(Purchase).filter(Purchase.user_id == current_user.id).all()
    
    for purchase in purchases:
        sweet = db.query(Sweet).filter(Sweet.id == purchase.sweet_id).first()
        purchase.sweet_name = sweet.name if sweet else "Unknown"
        purchase.user_email = current_user.email
    
    return purchases