package com.ebiz.backend.controller.admin;

import com.ebiz.backend.entity.User;
import com.ebiz.backend.repository.UserRepository;
import com.ebiz.backend.service.KeycloakService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Arrays;

@RestController
@RequestMapping("/api/admin/approvals")
@RequiredArgsConstructor
@Slf4j
public class AdminApprovalController {

    private final UserRepository userRepository;
    private final KeycloakService keycloakService;
    private final JavaMailSender mailSender;

    @GetMapping("/pending")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<List<User>> getPendingApprovals() {
        // Find users that are inactive and are either SELLER or AFFILIATE
        List<User> pendingUsers = userRepository.findByRoleInAndIsActiveFalse(Arrays.asList("SELLER", "AFFILIATE"));
        return ResponseEntity.ok(pendingUsers);
    }

    @GetMapping("/approved/sellers")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<List<User>> getApprovedSellers() {
        List<User> approvedSellers = userRepository.findByRoleAndIsActiveTrue("SELLER");
        return ResponseEntity.ok(approvedSellers);
    }

    @GetMapping("/approved/affiliates")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<List<User>> getApprovedAffiliates() {
        List<User> approvedAffiliates = userRepository.findByRoleAndIsActiveTrue("AFFILIATE");
        return ResponseEntity.ok(approvedAffiliates);
    }



    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<?> approveUser(@PathVariable String id) {
        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Registration not found"));
        }

        User user = optionalUser.get();
        if (Boolean.TRUE.equals(user.getIsActive())) {
            return ResponseEntity.badRequest().body(Map.of("message", "User is already active"));
        }

        String tempPassword = generateTemporaryPassword();

        try {
            // 1. Create User in Keycloak with the temporary password and enable them
            keycloakService.createUser(user.getEmail(), tempPassword, user.getRole(), true);

            // 2. Email the temporary password
            sendTemporaryPasswordEmail(user.getEmail(), tempPassword, user.getRole());

            // 3. Mark active in MongoDB local database
            user.setIsActive(true);
            userRepository.save(user);

            log.info("Successfully approved user {} as {}", user.getEmail(), user.getRole());
            return ResponseEntity.ok(Map.of("message", "User approved successfully. Temporary password sent to email."));
        } catch (Exception e) {
            log.error("Failed to approve user {}: {}", user.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to approve user: " + e.getMessage()));
        }
    }

    private String generateTemporaryPassword() {
        String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lower = "abcdefghijklmnopqrstuvwxyz";
        String digits = "0123456789";
        String special = "!@#$";
        String allChars = upper + lower + digits + special;
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        
        // Ensure at least one character from each set
        sb.append(upper.charAt(random.nextInt(upper.length())));
        sb.append(lower.charAt(random.nextInt(lower.length())));
        sb.append(digits.charAt(random.nextInt(digits.length())));
        sb.append(special.charAt(random.nextInt(special.length())));
        
        for (int i = 4; i < 10; i++) {
            sb.append(allChars.charAt(random.nextInt(allChars.length())));
        }
        
        return sb.toString();
    }

    private void sendTemporaryPasswordEmail(String email, String tempPassword, String role) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Ebiz - Your " + role + " Account Has Been Approved!");
            message.setText("Congratulations!\n\nYour application to become a " + role.toLowerCase() + 
                    " on Ebiz has been approved by our administrators.\n\n" +
                    "You can log in to your account with the following temporary password:\n" +
                    "Password: " + tempPassword + "\n\n" +
                    "Please log in and update your password immediately upon access.\n\n" +
                    "Best regards,\nThe Ebiz Team");
            mailSender.send(message);
            log.info("Sent temporary password to {}", email);
        } catch (Exception e) {
            log.error("Failed to send temporary password email to: {}", email, e);
        }
    }
}
