from typing import Sequence
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.repositories.assets import AssetRepository
from app.schemas.asset import AssetCreate, AssetRead, ActivityRead, AssetStatus

router = APIRouter(prefix="/assets", tags=["assets"])


@router.get("", response_model=Sequence[AssetRead])
def list_assets(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    repo = AssetRepository(db)
    return repo.list()


@router.post("", response_model=AssetRead, status_code=status.HTTP_201_CREATED)
def create_asset(
    payload: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = AssetRepository(db)
    try:
        return repo.create(owner_id=current_user.id, **payload.model_dump())
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Asset serial number already exists",
        ) from exc


@router.post("/{asset_id}/checkout", response_model=AssetRead)
def checkout_asset(
    asset_id: UUID,
    assigned_user_id: UUID,
    details: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = AssetRepository(db)
    asset = repo.checkout(asset_id, assigned_user_id, current_user.id, details)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.post("/{asset_id}/checkin", response_model=AssetRead)
def checkin_asset(
    asset_id: UUID,
    details: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = AssetRepository(db)
    asset = repo.checkin(asset_id, current_user.id, details)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.get("/{asset_id}/history", response_model=Sequence[ActivityRead])
def get_asset_history(
    asset_id: UUID,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    repo = AssetRepository(db)
    return repo.get_history(asset_id)
