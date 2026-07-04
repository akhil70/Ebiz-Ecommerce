package com.ebiz.backend.controller;

import com.ebiz.backend.entity.Product;
import com.ebiz.backend.entity.User;
import com.ebiz.backend.service.SellerService;
import com.ebiz.backend.service.ProductService;
import com.ebiz.backend.repository.UserRepository;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/seller")
@RequiredArgsConstructor
public class SellerController {

    private final SellerService sellerService;
    private final ProductService productService;
    private final UserRepository userRepository;

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

    private String getUserId(Jwt jwt) {
        String email = getEmail(jwt);
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/onboard")
    public ResponseEntity<String> onboardSeller(@AuthenticationPrincipal Jwt jwt) {
        try {
            String email = getEmail(jwt);
            String onboardingUrl = sellerService.onboardUserAsSeller(email);
            return ResponseEntity.ok(onboardingUrl);
        } catch (StripeException e) {
            return ResponseEntity.internalServerError().body("Stripe error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getSellerProfile(@AuthenticationPrincipal Jwt jwt) {
        String email = getEmail(jwt);
        return ResponseEntity.ok(sellerService.getProfile(email));
    }

    @GetMapping("/products")
    public ResponseEntity<?> getSellerProducts(@AuthenticationPrincipal Jwt jwt) {
        String email = getEmail(jwt);
        return ResponseEntity.ok(sellerService.getSellerProducts(email));
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getSellerOrders(@AuthenticationPrincipal Jwt jwt) {
        String email = getEmail(jwt);
        return ResponseEntity.ok(sellerService.getSellerOrders(email));
    }

    @PostMapping("/products")
    @PreAuthorize("hasRole('seller')")
    public ResponseEntity<?> createProduct(@AuthenticationPrincipal Jwt jwt, @RequestBody Product product) {
        try {
            String userId = getUserId(jwt);
            product.setSellerId(userId);
            Product savedProduct = productService.save(product);
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error creating product: " + e.getMessage()));
        }
    }

    @PutMapping("/products/{id}")
    @PreAuthorize("hasRole('seller')")
    public ResponseEntity<?> updateProduct(@AuthenticationPrincipal Jwt jwt, @PathVariable String id, @RequestBody Product product) {
        try {
            String userId = getUserId(jwt);
            Product existingProduct = productService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            
            // Security check: Verify the seller owns the product
            if (existingProduct.getSellerId() == null || !existingProduct.getSellerId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "You do not have permission to update this product."));
            }
            
            product.setId(id);
            product.setSellerId(userId);
            Product savedProduct = productService.save(product);
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error updating product: " + e.getMessage()));
        }
    }

    @DeleteMapping("/products/{id}/soft")
    @PreAuthorize("hasRole('seller')")
    public ResponseEntity<?> softDeleteProduct(@AuthenticationPrincipal Jwt jwt, @PathVariable String id) {
        try {
            String userId = getUserId(jwt);
            Product existingProduct = productService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            
            // Security check
            if (existingProduct.getSellerId() == null || !existingProduct.getSellerId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "You do not have permission to delete this product."));
            }
            
            productService.softDelete(id);
            return ResponseEntity.ok(Map.of("message", "Product status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error updating product status: " + e.getMessage()));
        }
    }

    @DeleteMapping("/products/{id}/hard")
    @PreAuthorize("hasRole('seller')")
    public ResponseEntity<?> hardDeleteProduct(@AuthenticationPrincipal Jwt jwt, @PathVariable String id) {
        try {
            String userId = getUserId(jwt);
            Product existingProduct = productService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            
            // Security check
            if (existingProduct.getSellerId() == null || !existingProduct.getSellerId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "You do not have permission to delete this product."));
            }
            
            productService.hardDelete(id);
            return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error deleting product: " + e.getMessage()));
        }
    }
}
