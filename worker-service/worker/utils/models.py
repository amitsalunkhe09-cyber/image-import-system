from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    google_drive_id = Column(String)
    mime_type = Column(String)
    storage_path = Column(String)
    status = Column(String)
    retry_count = Column(Integer)