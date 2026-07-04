package com.ebiz.backend.dto;

import com.ebiz.backend.entity.Address;
import java.math.BigDecimal;
import java.util.List;

public class OrderDto {
    private List<OrderItemDto> items;
    private BigDecimal totalAmount;
    private Address shippingAddress;

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

    public Address getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(Address shippingAddress) {
        this.shippingAddress = shippingAddress;
    }
}
