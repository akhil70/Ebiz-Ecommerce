package com.ebiz.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
    private String productId;
    private String selectedSize;
    private String selectedColor;
    private int quantity;
    private BigDecimal price;
    private String imageId;

    public boolean isSameItem(String productId, String selectedSize, String selectedColor) {
        return Objects.equals(this.productId, productId) &&
                Objects.equals(this.selectedSize, selectedSize) &&
                Objects.equals(this.selectedColor, selectedColor);
    }
}
