from datetime import datetime
from typing import Sequence
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.asset import Asset, AssetActivity, AssetStatus


class AssetRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, *, limit: int = 100, offset: int = 0) -> Sequence[Asset]:
        query = select(Asset).order_by(Asset.created_at.desc()).limit(limit).offset(offset)
        return self.db.scalars(query).all()

    def get(self, asset_id: UUID) -> Asset | None:
        return self.db.get(Asset, asset_id)

    def create(
        self,
        *,
        name: str,
        asset_type: str,
        serial_number: str,
        location: str,
        owner_id: UUID,
        status: AssetStatus = AssetStatus.STOCK,
        warranty_expiry: datetime | None = None,
        hardware_info: dict | None = None,
    ) -> Asset:
        asset = Asset(
            name=name,
            asset_type=asset_type,
            serial_number=serial_number,
            location=location,
            owner_id=owner_id,
            status=status,
            warranty_expiry=warranty_expiry,
            hardware_info=hardware_info,
        )
        self.db.add(asset)
        
        # Log initial creation
        activity = AssetActivity(
            asset=asset,
            actor_id=owner_id,
            action="created",
            details="Asset record created in system"
        )
        self.db.add(activity)
        
        self.db.commit()
        self.db.refresh(asset)
        return asset

    def checkout(self, asset_id: UUID, user_id: UUID, actor_id: UUID, details: str | None = None) -> Asset | None:
        asset = self.get(asset_id)
        if not asset:
            return None
        
        asset.status = AssetStatus.DEPLOYED
        asset.assigned_user_id = user_id
        
        activity = AssetActivity(
            asset_id=asset_id,
            actor_id=actor_id,
            action="checkout",
            details=details or f"Assigned to user {user_id}"
        )
        self.db.add(activity)
        self.db.commit()
        self.db.refresh(asset)
        return asset

    def checkin(self, asset_id: UUID, actor_id: UUID, details: str | None = None) -> Asset | None:
        asset = self.get(asset_id)
        if not asset:
            return None
        
        asset.status = AssetStatus.STOCK
        asset.assigned_user_id = None
        
        activity = AssetActivity(
            asset_id=asset_id,
            actor_id=actor_id,
            action="checkin",
            details=details or "Returned to stock"
        )
        self.db.add(activity)
        self.db.commit()
        self.db.refresh(asset)
        return asset

    def get_history(self, asset_id: UUID) -> Sequence[AssetActivity]:
        query = select(AssetActivity).where(AssetActivity.asset_id == asset_id).order_by(AssetActivity.created_at.desc())
        return self.db.scalars(query).all()
