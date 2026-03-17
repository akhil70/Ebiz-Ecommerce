package com.ebiz.backend.dto;

import lombok.Data;

@Data
public class CartRequest {
    private String productId;
    private int quantity;
    private String selectedSize;
    private String selectedColor;
}
