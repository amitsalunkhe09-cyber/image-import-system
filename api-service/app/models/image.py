from sqlalchemy import Column, Integer, String,  BigInteger
from app.db.base import Base

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String,nullable=False)
    google_drive_id = Column(String,unique=True, index=True, nullable=False)
    size = Column(BigInteger, nullable=False)
    mime_type = Column(String,nullable=False)
    storage_path = Column(String,nullable=True)
    status = Column(String, default="pending", nullable=False)
    retry_count = Column(Integer, default=0, nullable=False)