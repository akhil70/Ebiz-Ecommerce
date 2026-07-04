package com.ebiz.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "otp_codes")
public class OtpCode {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String otp;

    @Builder.Default
    @Indexed(expireAfterSeconds = 300) // TTL index: documents expire 5 minutes after creation
    private LocalDateTime createdAt = LocalDateTime.now();
}
