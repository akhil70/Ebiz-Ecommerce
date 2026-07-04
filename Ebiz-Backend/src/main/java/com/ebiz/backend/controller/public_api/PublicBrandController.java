package com.ebiz.backend.controller.public_api;

import com.ebiz.backend.entity.Brand;
import com.ebiz.backend.service.BrandService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "*")
public class PublicBrandController {

    private final BrandService brandService;
    private final com.ebiz.backend.service.KeycloakService keycloakService;

    public PublicBrandController(BrandService brandService, com.ebiz.backend.service.KeycloakService keycloakService) {
        this.brandService = brandService;
        this.keycloakService = keycloakService;
    }

    @GetMapping
    public ResponseEntity<List<Brand>> getActiveBrands() {
        return ResponseEntity.ok(brandService.findAllActive());
    }

    @GetMapping("/reset-passwords")
    public ResponseEntity<?> resetPasswords() {
        try {
            keycloakService.updatePassword("jane_affiliate@ebiz.com", "12345678");
            return ResponseEntity.ok("Passwords reset successfully to 12345678");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
