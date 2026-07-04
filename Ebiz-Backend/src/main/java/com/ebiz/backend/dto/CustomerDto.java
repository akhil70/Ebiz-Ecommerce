package com.ebiz.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDto {
    private String id;
    private String customer; // User's name
    private String email;
    private int orders;
    private BigDecimal totalSpent;
    private String city;
    private LocalDateTime lastSeen;
    private LocalDateTime lastOrder;
}
