import os
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError

DATABASE_URL = os.getenv("DATABASE_URL")

MAX_RETRIES = 10
WAIT_SECONDS = 2

engine = None

for attempt in range(MAX_RETRIES):
    try:
        engine = create_engine(DATABASE_URL)
        # test connection
        conn = engine.connect()
        conn.close()
        break
    except OperationalError:
        print(f"Database not ready, retrying ({attempt + 1}/{MAX_RETRIES})...")
        time.sleep(WAIT_SECONDS)
else:
    raise Exception("Database not ready after retries")

SessionLocal = sessionmaker(bind=engine)