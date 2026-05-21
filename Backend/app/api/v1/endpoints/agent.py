from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.alert import Alert

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
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Asset already registered"
        )

class AgentHeartbeat(BaseModel):
    serial_number: str
    hardware_info: dict[str, Any]

from app.core.websocket import manager

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

    alerts_to_send = []
    hw = payload.hardware_info
    
    from app.models.setting import Setting
    
    def get_threshold(key: str, default: float) -> float:
        s = db.scalar(select(Setting).where(Setting.key == key))
        try:
            return float(s.value) if s else default
        except (ValueError, TypeError):
            return default

    cpu_threshold = get_threshold("threshold_cpu", 95.0)
    ram_threshold = get_threshold("threshold_ram", 90.0)
    disk_threshold = get_threshold("threshold_disk", 90.0)
    
    if hw.get("memory", {}).get("percentage", 0) > ram_threshold:
        alert = Alert(asset_id=asset.id, type="MEMORY_HIGH", message=f"High RAM usage: {hw['memory']['percentage']}%")
        db.add(alert)
        alerts_to_send.append({"type": alert.type, "message": alert.message})
    
    for disk in hw.get("disks", []):
        if disk.get("percentage", 0) > disk_threshold:
            alert = Alert(asset_id=asset.id, type="DISK_FULL", message=f"Disk {disk['mountpoint']} is nearly full ({disk['percentage']}%)")
            db.add(alert)
            alerts_to_send.append({"type": alert.type, "message": alert.message})
            
    if hw.get("cpu", {}).get("total_usage", 0) > cpu_threshold:
        alert = Alert(asset_id=asset.id, type="CPU_HIGH", message=f"Critical CPU usage: {hw['cpu']['total_usage']}%")
        db.add(alert)
        alerts_to_send.append({"type": alert.type, "message": alert.message})
    
    db.commit()

    await manager.broadcast({
        "type": "HEARTBEAT",
        "asset_id": str(asset.id),
        "serial_number": asset.serial_number,
        "status": "online",
        "hostname": asset.name,
        "alerts": alerts_to_send
    })
    
    return {"status": "ok"}
