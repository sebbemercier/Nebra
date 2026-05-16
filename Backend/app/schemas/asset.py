from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class AssetCreate(BaseModel):
    name: str
    asset_type: str
    serial_number: str
    location: str
    status: str = "unverified"
    warranty_expiry: datetime | None = None


class AssetRead(BaseModel):
    id: UUID
    name: str
    asset_type: str
    serial_number: str
    location: str
    status: str
    warranty_expiry: datetime | None
    hardware_info: dict | None
    owner_id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}
