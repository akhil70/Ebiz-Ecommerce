package com.ebiz.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AwsS3Service {

    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket.name:placeholder-ebiz-bucket}")
    private String bucketName;

    /**
     * Generates a temporary URL allowing the frontend to upload directly to S3.
     */
    public String generatePresignedUploadUrl(String originalFileName, String contentType) {
        // Sanitize and generate unique name
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

        try {
            PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(uniqueFileName)
                .contentType(contentType)
                .build();

            PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(15)) // URL expires in 15 mins
                .putObjectRequest(objectRequest)
                .build();

            String presignedUrl = s3Presigner.presignPutObject(presignRequest).url().toString();
            log.info("Generated presigned URL for file: {}", uniqueFileName);
            
            return presignedUrl;
        } catch (Exception e) {
            log.error("Failed to generate presigned S3 url", e);
            throw new RuntimeException("Could not generate upload URL");
        }
    }
}
