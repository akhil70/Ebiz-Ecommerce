package com.ebiz.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class OrderDto {
    private List<OrderItemDto> items;
    private BigDecimal totalAmount;

    public OrderDto() {
    }

    public List<OrderItemDto> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDto> items) {
        this.items = items;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}
