package com.ebiz.backend.controller.public_api;

import com.ebiz.backend.dto.AuthRequests;
import com.ebiz.backend.entity.User;
import com.ebiz.backend.repository.UserRepository;
import com.ebiz.backend.service.KeycloakService;
import com.ebiz.backend.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final OtpService otpService;
    private final KeycloakService keycloakService;
    private final UserRepository userRepository;

    @PostMapping("/signup/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody AuthRequests.SendOtpRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }

        try {
            // Check if user already exists in Keycloak or MongoDB
            if (keycloakService.checkUserExists(request.getEmail()) || userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "User with this email already exists"));
            }

            otpService.generateAndSendOtp(request.getEmail());
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully to " + request.getEmail()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An unexpected error occurred: " + e.getMessage()));
        }
    }

    @PostMapping("/signup/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody AuthRequests.VerifyOtpRequest request) {
        if (request.getEmail() == null || request.getOtp() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email, OTP and Password are required"));
        }

        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());

        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid or expired OTP"));
        }

        try {
            // Determine Role and Account Status
            String requestedRole = (request.getRole() != null && !request.getRole().isBlank())
                    ? request.getRole().toUpperCase()
                    : "USER";
            String role = requestedRole.equals("SELLER") ? "SELLER" : "USER"; // Fallback to USER if invalid
            boolean enabled = !role.equals("SELLER"); // Sellers are disabled until admin approval

            // 1. Register in Keycloak
            keycloakService.createUser(request.getEmail(), request.getPassword(), role, enabled);

            // 2. Save in Local DB
            User newUser = User.builder()
                    .email(request.getEmail())
                    .name(request.getName() != null ? request.getName() : request.getEmail().split("@")[0])
                    .role(role)
                    .isActive(enabled)
                    .build();
            userRepository.save(newUser);

            if (!enabled) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(Map.of("message", "Seller account created successfully. Waiting for admin approval."));
            }
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "User verified and created successfully"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create user: " + e.getMessage()));
        }
    }

    @PostMapping("/signup/verify-otp-temporary")
    public ResponseEntity<?> verifyOtpTemporary(@RequestBody AuthRequests.VerifyOtpRequest request) {
        if (request.getEmail() == null || request.getOtp() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and OTP are required"));
        }

        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());

        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid or expired OTP"));
        }

        try {
            String requestedRole = (request.getRole() != null && !request.getRole().isBlank())
                    ? request.getRole().toUpperCase()
                    : "SELLER";
            String role = requestedRole.equals("AFFILIATE") ? "AFFILIATE" : "SELLER";

            // Save only in local MongoDB database in inactive state
            User newUser = User.builder()
                    .email(request.getEmail())
                    .name(request.getName() != null && !request.getName().isBlank() ? request.getName() : request.getEmail().split("@")[0])
                    .role(role)
                    .isActive(false) // Needs admin approval to activate
                    .needsPasswordReset(true) // Requires password reset on login
                    .build();
            userRepository.save(newUser);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Email verified. Registration submitted for admin approval."));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to submit registration: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequests.LoginRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username and password are required"));
        }

        ResponseEntity<Map> loginResponse = keycloakService.loginUser(request.getUsername(), request.getPassword());
        
        if (loginResponse.getStatusCode().is2xxSuccessful() && loginResponse.getBody() != null) {
            Map<String, Object> body = new HashMap<>(loginResponse.getBody());
            
            Optional<User> userOpt = userRepository.findByEmail(request.getUsername());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (Boolean.TRUE.equals(user.getNeedsPasswordReset())) {
                    body.put("mustChangePassword", true);
                }
                body.put("role", user.getRole());
            }
            return ResponseEntity.ok(body);
        }
        
        return loginResponse;
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal Jwt jwt, @RequestBody AuthRequests.ChangePasswordRequest request) {
        if (jwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "New password is required"));
        }

        String email = jwt.getClaimAsString("email");
        if (email == null) {
            email = jwt.getClaimAsString("preferred_username");
        }

        try {
            // 1. Update password in Keycloak
            keycloakService.updatePassword(email, request.getNewPassword());

            // 2. Set needsPasswordReset to false in MongoDB
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setNeedsPasswordReset(false);
                userRepository.save(user);
            }

            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to update password: " + e.getMessage()));
        }
    }
}
