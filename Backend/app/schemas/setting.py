from pydantic import BaseModel
from uuid import UUID

class SettingBase(BaseModel):
    key: str
    value: str
    category: str = "general"
    description: str | None = None

class SettingRead(SettingBase):
    id: UUID
    class Config:
        from_attributes = True

class SettingUpdate(BaseModel):
    value: str
