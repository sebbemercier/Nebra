from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str


class UserRead(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    role: str
    created_at: datetime

    model_config = {"from_attributes": True}
