# Local AWS S3 Testing Guide

This document explains how to test the S3 Pre-signed URL image upload functionality locally without needing actual AWS S3 credentials. We are using **MinIO**, an open-source, S3-compatible storage server running in Docker, to emulate AWS S3 on your local machine.

## Prerequisites
*   Docker installed and running.
*   Spring Boot Backend configured (already done in `application.yml`).

---

## 1. Starting the S3 Emulator (MinIO)

We need to spin up the MinIO Docker container to act as our local AWS server.

Run the following command in your terminal:
```bash
docker run -d \
  -p 4566:9000 \
  -p 9001:9001 \
  -e MINIO_ROOT_USER=testuser \
  -e MINIO_ROOT_PASSWORD=testpassword \
  --name localstack \
  minio/minio server /data --console-address ":9001"
```

*(Note: The container is named `localstack` for convenience, but it runs the MinIO image).*

---

## 2. Setting Up the Storage Bucket

Once the MinIO container is running, we must create the `ebiz-bucket` and grant it public download permissions just like a real S3 bucket.

Run this combined command to setup the bucket automatically:
```bash
docker exec localstack mc alias set myminio http://127.0.0.1:9000 testuser testpassword && \
docker exec localstack mc mb myminio/ebiz-bucket && \
docker exec localstack mc anonymous set download myminio/ebiz-bucket
```

---

## 3. Backend Configuration Explained

The Spring Boot backend has been updated to support local overrides. The `application.yml` has the following AWS configuration specifically for testing:

```yaml
aws:
  access:
    key:
      id: testuser
  secret:
    access:
      key: testpassword
  region: us-east-1
  s3:
    endpoint: http://localhost:4566
    bucket:
      name: ebiz-bucket
```

If `aws.s3.endpoint` is present, `AwsS3Config.java` intercepts the default AWS connection and forces **Path-Style Access**, redirecting all S3 traffic to our local Docker container on `localhost:4566`. When you want to use Real S3 in production, simply remove the `aws.s3.endpoint` configuration, insert your real credentials, and the code works flawlessly.

---

## 4. How to Test the Image Upload

1. **Start MinIO:** Ensure the container from step 1 & 2 is running.
2. **Start Backend:** Run your Spring Boot application locally.
3. **Open the Test UI:** Open `temp-s3-upload-demo.html` in any web browser.
4. **Upload:** Select an image and click **Upload to S3**.
5. **Verify:**
   - The UI will make a request to the Spring Boot backend (`GET /api/s3/presigned-url`).
   - The Spring Boot backend generates a secure upload URL mathematically signed for our local MinIO server.
   - The UI pushes the image directly to MinIO using a `PUT` request.
   - You can click the public link created or head to **[http://localhost:9001](http://localhost:9001)** (Username: `testuser` / Password: `testpassword`) to browse the MinIO dashboard visually and see your uploaded files.
