package com.ebiz.backend.controller.public_api;

import com.ebiz.backend.entity.Product;
import com.ebiz.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Optional;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ImageController {

    private final ProductRepository productRepository;

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getProductImage(@PathVariable String id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Product product = productOpt.get();
        String thumbnail = product.getThumbnail();
        
        if (thumbnail == null || thumbnail.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            String[] parts = thumbnail.split(",");
            String imageString;
            String contentType = "image/jpeg"; // Default fallback
            
            if (parts.length == 2 && parts[0].startsWith("data:")) {
                // Exists as header format data:image/png;base64,....
                String header = parts[0];
                int semiColonIndex = header.indexOf(";");
                if (semiColonIndex > 5) {
                    contentType = header.substring(5, semiColonIndex);
                }
                imageString = parts[1];
            } else {
                // Stored without headers
                imageString = thumbnail;
            }
            
            byte[] imageBytes = Base64.getDecoder().decode(imageString);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setCacheControl("max-age=3600"); // Cache briefly 
            
            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
