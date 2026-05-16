from datetime import datetime
from typing import Sequence
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.asset import Asset


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
        status: str = "unverified",
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
        self.db.commit()
        self.db.refresh(asset)
        return asset
