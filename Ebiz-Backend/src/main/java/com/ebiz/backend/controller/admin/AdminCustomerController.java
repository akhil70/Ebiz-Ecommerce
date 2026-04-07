package com.ebiz.backend.controller.admin;

import com.ebiz.backend.dto.CustomerDto;
import com.ebiz.backend.entity.Order;
import com.ebiz.backend.entity.User;
import com.ebiz.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
public class AdminCustomerController {

    private final MongoTemplate mongoTemplate;
    private final UserRepository userRepository;

    @GetMapping("/purchased")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<List<CustomerDto>> getPurchasedCustomers() {
        Query query = new Query();
        query.addCriteria(Criteria.where("userId").ne(null));
        
        List<String> userIds = mongoTemplate.findDistinct(query, "userId", "orders", String.class);
        
        List<User> users = userRepository.findAllById(userIds);
        
        // Fetch all orders for these users to calculate stats
        Query ordersQuery = new Query(Criteria.where("userId").in(userIds));
        List<Order> allOrders = mongoTemplate.find(ordersQuery, Order.class);
        
        // Group orders by userId
        Map<String, List<Order>> ordersByUser = allOrders.stream()
                .collect(Collectors.groupingBy(Order::getUserId));
                
        List<CustomerDto> customerDtos = new ArrayList<>();
        
        for (User user : users) {
            List<Order> userOrders = ordersByUser.getOrDefault(user.getId(), new ArrayList<>());
            
            BigDecimal totalSpent = userOrders.stream()
                    .map(order -> order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                    
            // Sort orders by createdAt descending to get the most recent order
            userOrders.sort(Comparator.comparing(Order::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
            
            LocalDateTime lastOrderDate = null;
            String city = null;
            if (!userOrders.isEmpty()) {
                Order latestOrder = userOrders.get(0);
                lastOrderDate = latestOrder.getCreatedAt();
                if (latestOrder.getShippingAddress() != null) {
                    city = latestOrder.getShippingAddress().getCity();
                }
            }
            
            CustomerDto dto = CustomerDto.builder()
                    .id(user.getId())
                    .customer(user.getName())
                    .email(user.getEmail())
                    .orders(userOrders.size())
                    .totalSpent(totalSpent)
                    .city(city)
                    .lastSeen(user.getUpdatedAt() != null ? user.getUpdatedAt() : user.getCreatedAt())
                    .lastOrder(lastOrderDate)
                    .build();
                    
            customerDtos.add(dto);
        }
        
        return ResponseEntity.ok(customerDtos);
    }
}
