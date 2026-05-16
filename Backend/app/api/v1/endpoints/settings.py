from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.database import get_db
from app.models.setting import Setting
from app.schemas.setting import SettingRead, SettingUpdate
from app.api.deps import get_current_user
from app.models.user import User
from typing import List

router = APIRouter(prefix="/settings", tags=["settings"])

@router.get("", response_model=List[SettingRead])
def get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only admins should see/manage global settings
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return db.scalars(select(Setting)).all()

@router.patch("/{key}", response_model=SettingRead)
def update_setting(
    key: str,
    payload: SettingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    setting = db.scalar(select(Setting).where(Setting.key == key))
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    
    setting.value = payload.value
    db.commit()
    db.refresh(setting)
    return setting
