**Image Import System**

An end-to-end image import platform that asynchronously imports images from Google Drive, uploads them to AWS S3
,and tracks their processing status using background worker.The system includes a live-updating UI to monitor imports progress.

**Features:**
1. Import images from a Google Drive folder using Service Account.
2. Asynchronous background processing using a worker service.
3. Upload images to AWS S3.
4. Store metadata and processing status in PostgreSQL.
5. live status updates in the UI using polling.
6. Clean and minimal React UI.
7. Fully Dockerized (API,  Worker, database)
8. Secure handling of credentials using enviroment variables.

**Architecture Overview:**

`React Frontend → FastAPI Backend → PostgreSQL ← Worker Service → Google Drive → AWS S3`
- **Frontend:** React(Vite)
- **Backend API:** FastAPI
- **Worker:** Python background worker
- **Database:** PostgreSQL
- **Cloud Storage:** AWS S3
- **External Source:** Google Drive API
- **Containerization:** Docker & Docker compose

**Enviroment Variables**

All sensitive data is managed via enviroment variables.
Create a .env file locally (do not commit it):
- DATABASE_URL=postgresql://user:password@postgres:5432/dbname
- AWS_ACCESS_KEY_ID=your_access_key
- AWS_SECRET_ACCESS_KEY=your_secret_key
- AWS_REGION=ap-south-1
- AWS_S3_BUCKET=imagr-import-platform
- GOOGLE_APPLICATION_CREDENTIALS=path/to/service_account.json

**Important**

.env and Google service account JSON files are intentionally excluded from the repository for security 
reason.

Refer to .env.example for required variables.

**HOW TO RUN THE PROJECT-->**

**1. Prerequisites:**
- Docker 
- Docker Compose
- Node.js (For frontend development)

**2. Start Backend & Worker:**

From project root:
`docker-compose up --build`

This will start:
- API service
- Worker service
- PostgreSQL database

**Start Frontend:**

`cd fronend`

`npm install`

`npm run dev`

Frontend will be avaliable at:

`http://localhost:5173`

**HOW IMAGE IMPORT WORKS**

1. User pastes a Google Drive Folder URL in the UI
2. Backend fetches image metadata and stores it with `pending`status.
3. Worker picks up pending images.
4. Images are downloaded from Google drive.
5. Images are uploaded at to AWS S3.
6. Status is updated to `Completed` or `Failed`.
7. UI auto-refreshes to show latest status.

**Status Handling**

- pending - waiting to be processed
- completed - successfully uploaded to S3
- failed - failed after retries

Status updates are reflected in the UI using polling every few seconds

**Notes**

- Polling is used for simplicity and reliability.
- The system is designed to be easily extendable.

**Author**

Amit Salunkhe
