from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.analytics import Analytics  # Assuming you have an Analytics model defined

router = APIRouter()

@router.post("/api/analytics/log", tags=["Analytics"])
async def log_analytics_event(event: Analytics, db: Session = Depends(get_db)):
    """
    Log an analytics event.

    Request body:
        - event: Analytics event data

    Returns:
        Success message
    """
    try:
        db.add(event)
        db.commit()
        db.refresh(event)
        return {"message": "Analytics event logged successfully", "event_id": event.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to log analytics event: {str(e)}")

@router.get("/api/analytics/report", tags=["Analytics"])
async def get_analytics_report(db: Session = Depends(get_db)):
    """
    Retrieve analytics report.

    Returns:
        List of logged analytics events
    """
    try:
        events = db.query(Analytics).all()
        return {"events": events}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve analytics report: {str(e)}")