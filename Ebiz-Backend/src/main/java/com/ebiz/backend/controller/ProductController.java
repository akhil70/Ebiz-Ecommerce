package com.ebiz.backend.controller;

import com.ebiz.backend.entity.Product;
import com.ebiz.backend.repository.ProductRepository;
import com.ebiz.backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final ProductService productService;

    public ProductController(ProductRepository productRepository, ProductService productService) {
        this.productRepository = productRepository;
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts(@RequestParam(required = false) Map<String, String> filters) {
        if (filters == null || filters.isEmpty()) {
            return productRepository.findAll();
        }
        return productService.fetchProducts(filters);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/stock")
    public ResponseEntity<?> checkStock(
            @PathVariable String id,
            @RequestParam String sizeType,
            @RequestParam String size) {

        boolean inStock = productService.isSizeInStock(id, sizeType, size);
        if (inStock) {
            return ResponseEntity.ok(Map.of("status", "success", "message", "Product size is in stock."));
        } else {
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", "Product of this size is stock out."));
        }
    }
}
