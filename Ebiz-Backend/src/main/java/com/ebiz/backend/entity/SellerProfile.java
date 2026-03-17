package com.ebiz.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "seller_profiles")
public class SellerProfile {

    @Id
    private String id;

    // Links to the main User document
    private String userId;

    private String storeName;
    private String storeDescription;

    // For handling Mediator payouts
    private String stripeAccountId;
    private Boolean isStripeOnboardingComplete;

    // Optional: Seller-specific commission rate, overrides platform default
    private BigDecimal commissionRate;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
