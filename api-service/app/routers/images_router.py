from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.image import Image

router = APIRouter(prefix="/images",
                   tags=["images"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def list_images(db:Session = Depends(get_db)):
    images = db.query(Image).order_by(Image.id.asc()).all()

    return [
        {
            "id": img.id,
            "name": img.name,
            "google_drive_id":img.google_drive_id,
            "size": img.size,
            "mime_type":img.mime_type,
            "status": img.status,
            "retry_count": img.retry_count,
        }
        for img in images
    ]