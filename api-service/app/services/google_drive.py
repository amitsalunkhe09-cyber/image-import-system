from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]

def get_drive_services():
    credentials = service_account.Credentials.from_service_account_file(
        "/credentials/service_account.json",
        scopes =SCOPES,
    )

    service = build("drive", "v3", credentials=credentials)
    return service

def list_files_in_folder(folder_id:str):
    service = get_drive_services()
    query = f"'{folder_id}' in parents and trashed=false"
    results = service.files().list(q=query,fields="files(id,name,mimeType,size)",).execute()
    return results.get('files', [])