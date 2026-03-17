package com.ebiz.backend.controller;

import com.ebiz.backend.dto.OrderDto;
import com.ebiz.backend.dto.OrderItemDto;
import com.ebiz.backend.entity.Order;
import com.ebiz.backend.entity.OrderItem;
import com.ebiz.backend.entity.Product;
import com.ebiz.backend.entity.User;
import com.ebiz.backend.repository.OrderRepository;
import com.ebiz.backend.repository.ProductRepository;
import com.ebiz.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderController(OrderRepository orderRepository, ProductRepository productRepository,
            UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Order> getUserOrders(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getSubject(); // Assuming JWT subject is email

        // In reality, you'd look up the user first to get their ID, but let's assume we
        // do that
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            return orderRepository.findByUserId(userOpt.get().getId());
        }
        return List.of();
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@AuthenticationPrincipal Jwt jwt, @RequestBody OrderDto orderDto) {
        String email = jwt.getSubject();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found for email: " + email);
        }

        Order order = new Order();
        order.setUserId(userOpt.get().getId());
        order.setTotalAmount(orderDto.getTotalAmount());
        // createdAt is set by @Builder.Default

        for (OrderItemDto itemDto : orderDto.getItems()) {
            // Need to change DTO productId from Long to String, assume it's String or parse
            // it
            Product product = productRepository.findById(String.valueOf(itemDto.getProductId())).orElse(null);
            if (product == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Product not found: " + itemDto.getProductId());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(product.getPrice());
            order.addItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }
}
