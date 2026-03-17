package com.ebiz.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "guest_buyers")
public class GuestBuyer {

    @Id
    private String id;

    private String socialMediaHandle;
    private String platform; // e.g., "INSTAGRAM", "TIKTOK", "FACEBOOK"

    private String email;
    private String phoneNumber;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
