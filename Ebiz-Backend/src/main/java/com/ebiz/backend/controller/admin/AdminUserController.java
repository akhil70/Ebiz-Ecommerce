package com.ebiz.backend.controller.admin;

import com.ebiz.backend.dto.AdminUserDto;
import com.ebiz.backend.dto.CreateAdminRequest;
import com.ebiz.backend.entity.User;
import com.ebiz.backend.repository.UserRepository;
import com.ebiz.backend.service.KeycloakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final KeycloakService keycloakService;

    @GetMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<List<AdminUserDto>> getAdmins() {
        List<User> adminUsers = userRepository.findByRole("ADMIN");
        
        List<AdminUserDto> dtoList = adminUsers.stream()
                .map(user -> AdminUserDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .status(user.getIsActive())
                        .createdAt(user.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    @PostMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<?> createAdmin(@RequestBody CreateAdminRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }

        try {
            if (keycloakService.checkUserExists(request.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "User with this email already exists"));
            }

            // Create in Keycloak with ADMIN role and directly enabled
            keycloakService.createUser(request.getEmail(), request.getPassword(), "ADMIN", true);

            // Create in local MongoDB mapping
            User newAdmin = User.builder()
                    .email(request.getEmail())
                    .name(request.getName() != null && !request.getName().isBlank() ? request.getName() : request.getEmail().split("@")[0])
                    .role("ADMIN")
                    .isActive(true)
                    .build();
            
            userRepository.save(newAdmin);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Admin user created successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create admin user: " + e.getMessage()));
        }
    }
}
