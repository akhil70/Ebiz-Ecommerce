package com.ebiz.backend.controller;

import com.ebiz.backend.dto.CartRequest;
import com.ebiz.backend.entity.Cart;
import com.ebiz.backend.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Extract Keycloak sub (UUID) directly from token — no DB lookup needed
    private String getUserId(Jwt jwt) {
        if (jwt == null)
            return null;
        return jwt.getSubject(); // e.g. "a3f7c2d1-4b5e-6789-abcd-ef0123456789"
    }

    @GetMapping
    public ResponseEntity<?> getCart(@AuthenticationPrincipal Jwt jwt) {
        String userId = getUserId(jwt);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found or unauthenticated");
        }
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@AuthenticationPrincipal Jwt jwt, @RequestBody CartRequest request) {
        String userId = getUserId(jwt);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found or unauthenticated");
        }
        try {
            Cart cart = cartService.addToCart(userId, request);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCartItemQuantity(@AuthenticationPrincipal Jwt jwt,
            @RequestBody CartRequest request) {
        String userId = getUserId(jwt);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found or unauthenticated");
        }
        try {
            Cart cart = cartService.updateQuantity(userId, request);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFromCart(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam String productId,
            @RequestParam(required = false) String selectedSize,
            @RequestParam(required = false) String selectedColor) {

        String userId = getUserId(jwt);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found or unauthenticated");
        }
        try {
            Cart cart = cartService.removeFromCart(userId, productId, selectedSize, selectedColor);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@AuthenticationPrincipal Jwt jwt) {
        String userId = getUserId(jwt);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found or unauthenticated");
        }
        cartService.clearCart(userId);
        return ResponseEntity.ok("Cart cleared successfully");
    }
}
