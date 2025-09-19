from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.database import get_db
from app.models.sweet import Sweet
from app.models.user import User
from app.schemas.sweet import SweetCreate, SweetUpdate, SweetResponse
from app.core.dependencies import get_current_user, get_current_admin_user

router = APIRouter(prefix="/sweets")

@router.post("/", response_model=SweetResponse, status_code=status.HTTP_201_CREATED)
def create_sweet(
    sweet: SweetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    existing_sweet = db.query(Sweet).filter(Sweet.name == sweet.name).first()
    if existing_sweet:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Sweet with name '{sweet.name}' already exists"
        )
    
    db_sweet = Sweet(**sweet.dict())
    db.add(db_sweet)
    db.commit()
    db.refresh(db_sweet)
    return db_sweet

@router.get("/", response_model=List[SweetResponse])
def get_sweets(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Sweet).filter(Sweet.is_available == True)
    sweets = query.offset(skip).limit(limit).all()
    return sweets

@router.get("/search", response_model=List[SweetResponse])
def search_sweets(
    name: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(Sweet)
    
    filters = [Sweet.is_available == True]
    
    if name:
        filters.append(Sweet.name.ilike(f"%{name}%"))
    if category:
        filters.append(Sweet.category.ilike(f"%{category}%"))
    if min_price is not None:
        filters.append(Sweet.price >= min_price)
    if max_price is not None:
        filters.append(Sweet.price <= max_price)
    
    if filters:
        query = query.filter(and_(*filters))
    
    return query.all()

@router.get("/{sweet_id}", response_model=SweetResponse)
def get_sweet(sweet_id: int, db: Session = Depends(get_db)):
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id, Sweet.is_available == True).first()
    if not sweet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sweet not found"
        )
    return sweet

@router.put("/{sweet_id}", response_model=SweetResponse)
def update_sweet(
    sweet_id: int,
    sweet_update: SweetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    db_sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    if not db_sweet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sweet not found"
        )
    
    update_data = sweet_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_sweet, field, value)
    
    db.commit()
    db.refresh(db_sweet)
    return db_sweet

@router.delete("/{sweet_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sweet(
    sweet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    db_sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    if not db_sweet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sweet not found"
        )
    
    db.delete(db_sweet)
    db.commit()
    return None

@router.get("/categories/list", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Sweet.category).filter(Sweet.is_available == True).distinct().all()
    return sorted([category[0] for category in categories])
