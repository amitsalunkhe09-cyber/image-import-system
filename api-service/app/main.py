from fastapi import FastAPI,Depends
from sqlalchemy.orm import Session
from starlette.middleware.cors import CORSMiddleware

from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.image import Image
from app.routers.import_router import router as import_router
from app.routers.images_router import router as images_router
from app.services.google_drive import list_files_in_folder

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Image import API")
app.add_middleware(
    CORSMiddleware,

allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(import_router)
app.include_router(images_router)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health():
    return {"status": "Api is running"}

@app.get("/db_health")
def db_health(db: Session = Depends(get_db)):
    return {"db":"connected"}

@app.get("/images_count")
def images_count(db: Session = Depends(get_db)):
    return {"count":db.query(Image).count()}

