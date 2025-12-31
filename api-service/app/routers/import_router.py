from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.image import Image
from app.services.google_drive import list_files_in_folder
from app.utils.drive_utils import extract_folder_id
router = APIRouter(
    prefix="/import",
    tags=["Import"]
)


class ImportRequest(BaseModel):
    folder_url: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/google-drive")
def import_google_drive(request: ImportRequest, db: Session = Depends(get_db)):
    try:
        folder_id = extract_folder_id(request.folder_url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    files = list_files_in_folder(folder_id)

    imported = 0
    skipped = 0

    for f in files:
        mime_type = f.get("mimeType", "")
        if not mime_type.startswith("image/"):
            continue  # skip non-images

        exists = db.query(Image).filter(
            Image.google_drive_id == f["id"]
        ).first()

        if exists:
            skipped += 1
            continue

        image = Image(
            name=f["name"],
            google_drive_id=f["id"],
            size=int(f.get("size", 0)),
            mime_type=mime_type,
            status="pending",
        )
        db.add(image)
        imported += 1

    db.commit()

    return {
        "message": "Import processed",
        "total_found": len(files),
        "imported": imported,
        "skipped": skipped,
        "skipped_reason": "Images already exist" if skipped else None,
    }