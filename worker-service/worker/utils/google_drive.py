from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import io

SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]
SERVICE_ACCOUNT_FILE = "/credentials/service_account.json"


def get_drive_service():
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=SCOPES,
    )
    return build("drive", "v3", credentials=credentials)


def download_file(file_id: str, filename: str):
    service = get_drive_service()

    request = service.files().get_media(fileId=file_id)
    fh = io.FileIO(f"/tmp/{filename}", "wb")
    downloader = MediaIoBaseDownload(fh, request)

    done = False
    while not done:
        status, done = downloader.next_chunk()
        print(f"[Worker] Download progress: {int(status.progress() * 100)}%")

    return f"/tmp/{filename}"