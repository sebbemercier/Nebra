from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.core.database import get_db
from app.repositories.assets import AssetRepository
from app.schemas.asset import AssetCreate, AssetRead
from pydantic import BaseModel
from typing import Any

router = APIRouter(prefix="/agent", tags=["agent"])

class AgentRegistration(BaseModel):
    hostname: str
    serial_number: str
    os_name: str
    os_version: str
    hardware_info: dict[str, Any]

@router.post("/register", response_model=AssetRead)
def register_agent(
    payload: AgentRegistration,
    db: Session = Depends(get_db)
):
    # For now, we use a default "system" owner or similar if we don't have one.
    # In a real app, you might use an API key to identify the site/owner.
    # Here, we'll just try to find the first user as owner for demo purposes, 
    # or a dedicated system user.
    from app.models.user import User
    from sqlalchemy import select
    
    owner = db.scalar(select(User).limit(1))
    if not owner:
        raise HTTPException(status_code=500, detail="No users found to own the asset")

    repo = AssetRepository(db)
    try:
        return repo.create(
            name=payload.hostname,
            asset_type="WORKSTATION",
            serial_number=payload.serial_number,
            location="Remote",
            owner_id=owner.id,
            status="verified",
            hardware_info=payload.hardware_info
        )
    except IntegrityError:
        db.rollback()
        # If it exists, we might want to update it. Let's handle heartbeat for updates.
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Asset already registered"
        )

class AgentHeartbeat(BaseModel):
    serial_number: str
    hardware_info: dict[str, Any]

from app.core.websocket import manager
...
@router.post("/heartbeat")
async def heartbeat(
    payload: AgentHeartbeat,
    db: Session = Depends(get_db)
):
    from app.models.asset import Asset
    from sqlalchemy import select
    
    asset = db.scalar(select(Asset).where(Asset.serial_number == payload.serial_number))
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    asset.hardware_info = payload.hardware_info
    db.commit()
    
    # Broadcast to all connected UI clients
    await manager.broadcast({
        "type": "HEARTBEAT",
        "asset_id": str(asset.id),
        "serial_number": asset.serial_number,
        "status": "online",
        "hostname": asset.name
    })
    
    return {"status": "ok"}
