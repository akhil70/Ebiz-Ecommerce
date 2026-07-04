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
import com.ebiz.backend.service.CartService;

import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartService cartService;

    private String getEmail(Jwt jwt) {
        if (jwt == null) return null;
        String email = jwt.getClaimAsString("email");
        if (email == null) {
            email = jwt.getClaimAsString("preferred_username");
        }
        if (email == null) {
            email = jwt.getSubject();
        }
        return email;
    }

    @GetMapping
    public List<Order> getUserOrders(@AuthenticationPrincipal Jwt jwt) {
        String email = getEmail(jwt);

        // In reality, you'd look up the user first to get their ID, but let's assume we
        // do that
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            List<Order> orders = orderRepository.findByUserId(userOpt.get().getId());
            
            // Enrich old orders that might be missing images
            for (Order order : orders) {
                if (order.getItems() != null) {
                    for (OrderItem item : order.getItems()) {
                        if (item.getImage() == null || item.getImage().isEmpty()) {
                            productRepository.findById(item.getProductId()).ifPresent(product -> {
                                String img = (product.getThumbnail() != null && !product.getThumbnail().isEmpty())
                                        ? product.getThumbnail()
                                        : (product.getImages() != null && !product.getImages().isEmpty() ? product.getImages().get(0) : "");
                                item.setImage(img);
                            });
                        }
                    }
                }
            }
            return orders;
        }
        return List.of();
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@AuthenticationPrincipal Jwt jwt, @RequestBody OrderDto orderDto) {
        String email = getEmail(jwt);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found for email: " + email);
        }

        Order order = new Order();
        order.setUserId(userOpt.get().getId());
        order.setShippingAddress(orderDto.getShippingAddress());
        // createdAt is set by @Builder.Default

        java.math.BigDecimal computedTotal = java.math.BigDecimal.ZERO;

        for (OrderItemDto itemDto : orderDto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId()).orElse(null);
            if (product == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Product not found: " + itemDto.getProductId());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(product.getPrice());
            
            String img = (product.getThumbnail() != null && !product.getThumbnail().isEmpty())
                    ? product.getThumbnail()
                    : (product.getImages() != null && !product.getImages().isEmpty() ? product.getImages().get(0) : "");
            orderItem.setImage(img);
            orderItem.setSellerId(product.getSellerId()); // Link seller to fix seller dashboard history
            orderItem.setAffiliateId(itemDto.getAffiliateId()); // Link affiliate for link tracking
            order.addItem(orderItem);


            if (product.getPrice() != null && itemDto.getQuantity() != null) {
                computedTotal = computedTotal
                        .add(product.getPrice().multiply(java.math.BigDecimal.valueOf(itemDto.getQuantity())));
            }
        }

        order.setTotalAmount(computedTotal);

        Order savedOrder = orderRepository.save(order);
        
        try {
            cartService.clearCart(jwt.getSubject());
        } catch (Exception e) {
            // Ignore if cart clearing fails
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }
}
