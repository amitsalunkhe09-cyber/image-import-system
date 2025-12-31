import os
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
# from app.db.session import MAX_RETRIES, WAIT_SECONDS, SessionLocal
from sqlalchemy import inspect
DATABASE_URL = os.getenv("DATABASE_URL")

MAX_RETRIES = 10
WAIT_SECONDS = 2

engine = None

for attempt in range(MAX_RETRIES):
    try:
        engine = create_engine(DATABASE_URL)
        conn = engine.connect()
        conn.close()
        break
    except OperationalError:
        print(f"[worker] DB not ready({attempt + 1}/{WAIT_SECONDS})")
        time.sleep(WAIT_SECONDS)
else:
    raise Exception("[worker] Database not ready")

def wait_for_table(engine):
    for i in range(10):
        inspector = inspect(engine)
        if "images" in inspector.get_table_names():
            return print("[Worker] Waiting for tables to be created")
        time.sleep(2)
    raise Exception("Tables not created")

SessionLocal = sessionmaker(bind=engine)