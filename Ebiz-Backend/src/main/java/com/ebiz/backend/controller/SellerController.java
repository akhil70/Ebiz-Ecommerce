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
}
