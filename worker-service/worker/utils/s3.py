import os
import boto3
# from google.auth.environment_vars import AWS_REGION

AWS_REGION = os.getenv("AWS_REGION")
S3_BUCKET = os.getenv("S3_BUCKET_NAME")

s3 = boto3.client("s3", region_name=AWS_REGION)

def upload_file(local_path: str, s3_key: str):
    s3.upload_file(local_path, S3_BUCKET, s3_key)
    return f"s3://{S3_BUCKET}/{s3_key}"