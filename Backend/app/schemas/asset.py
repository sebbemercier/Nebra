import enum
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class AssetStatus(str, enum.Enum):
    STOCK = "stock"
    DEPLOYED = "deployed"
    MAINTENANCE = "maintenance"
    ARCHIVED = "archived"


class AssetCreate(BaseModel):
    name: str
    asset_type: str
    serial_number: str
    location: str
    status: AssetStatus = AssetStatus.STOCK
    warranty_expiry: datetime | None = None

class AssetUpdate(BaseModel):
    name: str | None = None
    asset_type: str | None = None
    location: str | None = None
    status: AssetStatus | None = None
    warranty_expiry: datetime | None = None


class ActivityRead(BaseModel):
    id: UUID
    action: str
    details: str | None
    actor_id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}


class AssetRead(BaseModel):
    id: UUID
    name: str
    asset_type: str
    serial_number: str
    location: str
    status: AssetStatus
    warranty_expiry: datetime | None
    hardware_info: dict | None
    owner_id: UUID
    assigned_user_id: UUID | None
    created_at: datetime

    model_config = {"from_attributes": True}

class AlertRead(BaseModel):
    id: UUID
    asset_id: UUID
    type: str
    message: str
    is_resolved: bool
    created_at: datetime
    resolved_at: datetime | None

    model_config = {"from_attributes": True}
