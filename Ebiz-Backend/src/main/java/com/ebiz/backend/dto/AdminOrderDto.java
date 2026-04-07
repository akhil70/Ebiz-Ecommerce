package com.ebiz.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminOrderDto {
    private String id;
    private String customerName;
    private String customerEmail;
    private BigDecimal totalAmount;
    private String paymentStatus;
    private String fulfillmentStatus;
    private String deliveryType;
    private LocalDateTime createdAt;
}
