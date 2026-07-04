package com.ebiz.backend.dto;

import com.ebiz.backend.entity.Address;
import lombok.Data;

import java.util.List;

@Data
public class SocialCheckoutRequest {

    // Guest Buyer info
    private String socialMediaHandle;
    private String platform;
    private String email;
    private String phoneNumber;

    // Items to buy
    private List<CheckoutItem> items;

    // Delivery
    private Address shippingAddress;

    @Data
    public static class CheckoutItem {
        private String productId;
        private Integer quantity;
    }
}
