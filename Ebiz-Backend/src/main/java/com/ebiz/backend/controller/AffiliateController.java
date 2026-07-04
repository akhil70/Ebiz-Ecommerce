package com.ebiz.backend.controller;

import com.ebiz.backend.entity.Order;
import com.ebiz.backend.entity.OrderItem;
import com.ebiz.backend.entity.User;
import com.ebiz.backend.repository.OrderRepository;
import com.ebiz.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/affiliate")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AffiliateController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    private String getUserId(Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        if (email == null) {
            email = jwt.getClaimAsString("preferred_username");
        }
        if (email == null) {
            email = jwt.getSubject();
        }
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("Affiliate user profile not found"));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('affiliate')")
    public ResponseEntity<?> getAffiliateStats(@AuthenticationPrincipal Jwt jwt) {
        try {
            String affiliateId = getUserId(jwt);
            
            // Find all orders that contain items referred by this affiliate
            List<Order> orders = orderRepository.findAll();
            
            int totalItemsSold = 0;
            BigDecimal totalRevenue = BigDecimal.ZERO;
            List<Map<String, Object>> salesHistory = new ArrayList<>();
            
            for (Order order : orders) {
                if (order.getItems() == null) continue;
                for (OrderItem item : order.getItems()) {
                    if (affiliateId.equals(item.getAffiliateId())) {
                        totalItemsSold += item.getQuantity();
                        BigDecimal itemRevenue = BigDecimal.ZERO;
                        if (item.getPrice() != null && item.getQuantity() != null) {
                            itemRevenue = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                            totalRevenue = totalRevenue.add(itemRevenue);
                        }
                        
                        Map<String, Object> sale = new HashMap<>();
                        sale.put("orderId", order.getId());
                        sale.put("productName", item.getProductName());
                        sale.put("productId", item.getProductId());
                        sale.put("quantity", item.getQuantity());
                        sale.put("price", item.getPrice());
                        sale.put("revenue", itemRevenue);
                        sale.put("createdAt", order.getCreatedAt());
                        sale.put("status", order.getStatus());
                        salesHistory.add(sale);
                    }
                }
            }
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("affiliateId", affiliateId);
            stats.put("totalItemsSold", totalItemsSold);
            stats.put("totalRevenue", totalRevenue);
            stats.put("salesHistory", salesHistory);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error retrieving affiliate statistics", e);
            return ResponseEntity.badRequest().body(Map.of("message", "Error: " + e.getMessage()));
        }
    }
}
