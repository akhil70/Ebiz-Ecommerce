package com.ebiz.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product extends BaseEntity {

    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;

    private String brandId;
    private String categoryId;
    private String subcategoryId;
    private String sellerId; // Link product to a specific seller

    private Integer stock;
    private String sku;
    private String thumbnail;
    private List<String> images;

    private Boolean isFeatured = false;

    private Boolean isNewArrival = false;

    // Dynamic attributes for filtering (e.g., {"Color": "Red", "Size": "M"})
    private java.util.Map<String, String> attributes;

    // Size-specific inventory stocks (e.g., Shoe Size (US) 9 -> 10)
    private java.util.List<SizeStock> sizeStocks;

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class SizeStock {
        private String sizeType; // e.g., "Shoe Size (US)", "T-Shirt Size"
        private String size; // e.g., "9", "M"
        private Integer stock; // e.g., 10
    }

}
