package com.ebiz.backend.controller.public_api;

import com.ebiz.backend.service.AwsS3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/s3")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AwsS3Controller {

    private final AwsS3Service awsS3Service;

    @GetMapping("/presigned-url")
    public ResponseEntity<Map<String, String>> getPresignedUrl(
            @RequestParam String fileName,
            @RequestParam(defaultValue = "application/octet-stream") String contentType) {
        
        String url = awsS3Service.generatePresignedUploadUrl(fileName, contentType);
        
        // Also derive the final public URL without the query params
        // Assuming the bucket is publicly accessible
        String publicUrl = url.split("\\?")[0];
        
        return ResponseEntity.ok(Map.of(
                "uploadUrl", url,
                "publicUrl", publicUrl
        ));
    }
}
