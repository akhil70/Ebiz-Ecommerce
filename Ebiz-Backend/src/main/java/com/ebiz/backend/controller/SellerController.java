package com.ebiz.backend.controller;

import com.ebiz.backend.service.SellerService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/seller")
@RequiredArgsConstructor
public class SellerController {

    private final SellerService sellerService;

    @PostMapping("/onboard")
    public ResponseEntity<String> onboardSeller(@AuthenticationPrincipal Jwt jwt) {
        try {
            String onboardingUrl = sellerService.onboardUserAsSeller(jwt.getSubject());
            return ResponseEntity.ok(onboardingUrl);
        } catch (StripeException e) {
            return ResponseEntity.internalServerError().body("Stripe error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getSellerProfile(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(sellerService.getProfile(jwt.getSubject()));
    }

    @GetMapping("/products")
    public ResponseEntity<?> getSellerProducts(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(sellerService.getSellerProducts(jwt.getSubject()));
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getSellerOrders(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(sellerService.getSellerOrders(jwt.getSubject()));
    }
}
