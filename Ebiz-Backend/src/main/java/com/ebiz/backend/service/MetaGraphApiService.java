package com.ebiz.backend.service;

import com.ebiz.backend.entity.Product;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MetaGraphApiService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${meta.graph-api.access-token:placeholder_token}")
    private String accessToken;

    @Value("${meta.graph-api.catalog-id:placeholder_catalog_id}")
    private String catalogId;

    public void syncProductToFacebook(Product product) {
        if ("placeholder_token".equals(accessToken) || "placeholder_catalog_id".equals(catalogId)) {
            log.warn("Meta Graph API credentials not configured. Skipping facebook sync for product: {}", product.getId());
            return;
        }

        String url = String.format("https://graph.facebook.com/v19.0/%s/products", catalogId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        Map<String, Object> body = new HashMap<>();
        body.put("name", product.getName());
        body.put("description", product.getDescription() != null ? product.getDescription() : product.getName());
        body.put("price", product.getPrice().intValue() * 100); 
        body.put("currency", "USD"); 
        
        // This MUST be the link that goes through your SocialCheckoutController or frontend
        body.put("url", "https://yourecommerce.com/products/" + product.getId());
        
        List<String> images = product.getImages();
        String imageUrl = (images != null && !images.isEmpty()) 
                ? images.get(0) 
                : "https://yourecommerce.com/default-image.jpg";
        body.put("image_url", imageUrl);
        
        body.put("retailer_id", product.getId()); 
        body.put("brand", "Ebiz");
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Successfully synced product {} to Facebook Catalog", product.getId());
            } else {
                log.error("Failed to sync product {}. Status: {}, Response: {}", 
                        product.getId(), response.getStatusCode(), response.getBody());
            }
        } catch (Exception e) {
            log.error("Exception occurred while syncing product to Facebook: {}", e.getMessage());
        }
    }
}
