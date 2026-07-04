package com.ebiz.backend.controller.admin;

import com.ebiz.backend.dto.AdminOrderDto;
import com.ebiz.backend.entity.Order;
import com.ebiz.backend.entity.User;
import com.ebiz.backend.repository.OrderRepository;
import com.ebiz.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<List<AdminOrderDto>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();

        // Get unique user IDs from orders
        List<String> userIds = orders.stream()
                .map(Order::getUserId)
                .filter(id -> id != null)
                .distinct()
                .collect(Collectors.toList());

        // Fetch users in a batch
        List<User> users = (List<User>) userRepository.findAllById(userIds);
        Map<String, User> userMap = users.stream().collect(Collectors.toMap(User::getId, u -> u));

        List<AdminOrderDto> adminOrderDtos = new ArrayList<>();
        
        for (Order order : orders) {
            User user = null;
            if (order.getUserId() != null) {
                user = userMap.get(order.getUserId());
            }

            AdminOrderDto dto = AdminOrderDto.builder()
                    .id(order.getId())
                    .customerName(user != null ? user.getName() : "Guest")
                    .customerEmail(user != null ? user.getEmail() : "N/A")
                    .totalAmount(order.getTotalAmount())
                    .paymentStatus(order.getStatus()) // Using general order status as a fallback proxy
                    .fulfillmentStatus("UNFULFILLED") // Stub fallback
                    .deliveryType("Standard shipping") // Stub fallback
                    .createdAt(order.getCreatedAt())
                    .build();

            adminOrderDtos.add(dto);
        }

        // Sort by created at descending
        adminOrderDtos.sort((o1, o2) -> {
            if (o1.getCreatedAt() == null) return 1;
            if (o2.getCreatedAt() == null) return -1;
            return o2.getCreatedAt().compareTo(o1.getCreatedAt());
        });

        return ResponseEntity.ok(adminOrderDtos);
    }
}
