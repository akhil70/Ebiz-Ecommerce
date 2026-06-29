package com.ebiz.backend.controller.admin;

import com.ebiz.backend.entity.User;
import com.ebiz.backend.repository.UserRepository;
import com.ebiz.backend.service.KeycloakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/sellers")
@RequiredArgsConstructor
public class AdminSellerApprovalController {

    private final UserRepository userRepository;
    private final KeycloakService keycloakService;

    @GetMapping("/pending")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<List<User>> getPendingSellers() {
        List<User> pendingSellers = userRepository.findByRoleAndIsActiveFalse("SELLER");
        return ResponseEntity.ok(pendingSellers);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<?> approveSeller(@PathVariable String id) {
        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Seller not found"));
        }

        User seller = optionalUser.get();
        if (seller.getIsActive() != null && seller.getIsActive()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Seller is already active"));
        }

        try {
            // Enable in Keycloak
            keycloakService.enableUser(seller.getEmail());

            // Update local DB
            seller.setIsActive(true);
            userRepository.save(seller);

            return ResponseEntity.ok(Map.of("message", "Seller approved successfully. They can now login."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to approve seller: " + e.getMessage()));
        }
    }
}
