package com.ebiz.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import software.amazon.awssdk.services.s3.S3Configuration;

@Configuration
public class AwsS3Config {

    @Value("${aws.access.key.id:placeholder_access_key}")
    private String accessKey;

    @Value("${aws.secret.access.key:placeholder_secret_key}")
    private String secretKey;

    @Value("${aws.region:us-east-1}")
    private String region;

    @Value("${aws.s3.endpoint:}")
    private String endpoint;

    @Bean
    public S3Presigner s3Presigner() {
        if ("placeholder_access_key".equals(accessKey) && (endpoint == null || endpoint.isEmpty())) {
            // Returns a dummy presigner so context still loads without credentials
            return S3Presigner.builder().region(Region.US_EAST_1).build();
        }

        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);
        
        S3Presigner.Builder builder = S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(credentials));

        if (endpoint != null && !endpoint.isEmpty()) {
            builder.endpointOverride(java.net.URI.create(endpoint));
            builder.serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(true).build());
        }

        return builder.build();
    }
}
