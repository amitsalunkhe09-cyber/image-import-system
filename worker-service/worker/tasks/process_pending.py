import time
from worker.utils.db import SessionLocal
from worker.utils.models import Image
from worker.utils.google_drive import download_file
from worker.utils.s3 import upload_file

MAX_RETRIES = 3
SLEEP_SECONDS = 5


def process_single_image(db, image: Image):
    try:
        print(f"[Worker] Processing image ID={image.id}, name={image.name}")

        # 1️⃣ Download from Google Drive
        local_path = download_file(
            file_id=image.google_drive_id,
            filename=image.name,
        )

        # 2️⃣ Upload to S3
        s3_key = f"images/{image.id}/{image.name}"
        s3_path = upload_file(local_path, s3_key)

        # 3️⃣ Update DB on success
        image.status = "completed"
        image.storage_path = s3_path
        db.commit()

        print(f"[Worker] Image {image.id} completed")

    except Exception as e:
        # 4️⃣ Handle failure safely
        image.retry_count += 1

        if image.retry_count >= MAX_RETRIES:
            image.status = "failed"
            print(f"[Worker] Image {image.id} FAILED after retries")
        else:
            print(
                f"[Worker] Error processing image {image.id}, "
                f"retry {image.retry_count}/{MAX_RETRIES}: {e}"
            )

        db.commit()


def process_pending_images():
    print("[Worker] Worker loop started")

    while True:
        db = SessionLocal()

        pending_images = db.query(Image).filter(
            Image.status == "pending"
        ).all()

        if not pending_images:
            print("[Worker] No pending images, sleeping...")
            db.close()
            time.sleep(SLEEP_SECONDS)
            continue

        print(f"[Worker] Found {len(pending_images)} pending images")

        for image in pending_images:
            process_single_image(db, image)

        db.close()
        time.sleep(SLEEP_SECONDS)