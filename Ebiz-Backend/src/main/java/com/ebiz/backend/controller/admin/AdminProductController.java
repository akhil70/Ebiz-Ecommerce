package com.ebiz.backend.controller.admin;

import com.ebiz.backend.controller.base.BaseController;
import com.ebiz.backend.entity.Product;
import com.ebiz.backend.service.BaseService;
import com.ebiz.backend.service.ProductService;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController extends BaseController<Product, String> {

    private final ProductService productService;

    @Override
    protected BaseService<Product, String> getService() {
        return productService;
    }

    @Override
    @org.springframework.web.bind.annotation.GetMapping
    public org.springframework.http.ResponseEntity<java.util.List<Product>> getAllActive() {
        java.util.List<Product> products = productService.findAllActive();
        productService.populateSellerInfo(products);
        return org.springframework.http.ResponseEntity.ok(products);
    }

    @Override
    @org.springframework.web.bind.annotation.GetMapping("/all")
    public org.springframework.http.ResponseEntity<java.util.List<Product>> getAll() {
        java.util.List<Product> products = productService.findAll();
        productService.populateSellerInfo(products);
        return org.springframework.http.ResponseEntity.ok(products);
    }

    @Override
    @org.springframework.web.bind.annotation.GetMapping("/{id}")
    public org.springframework.http.ResponseEntity<Product> getById(@org.springframework.web.bind.annotation.PathVariable String id) {
        java.util.Optional<Product> entity = productService.findById(id);
        entity.ifPresent(productService::populateSellerInfo);
        return entity.map(org.springframework.http.ResponseEntity::ok)
                .orElseGet(() -> org.springframework.http.ResponseEntity.notFound().build());
    }


    @PutMapping("/{id}/stock")

    @PreAuthorize("hasRole('admin')")
    public com.ebiz.backend.entity.Product updateStock(
            @org.springframework.web.bind.annotation.PathVariable String id,
            @org.springframework.web.bind.annotation.RequestBody java.util.Map<String, Object> payload) {

        String sizeType = (String) payload.get("sizeType");
        String size = (String) payload.get("size");
        Integer stock = (Integer) payload.get("stock");

        if (sizeType == null || size == null || stock == null) {
            throw new IllegalArgumentException("sizeType, size, and stock are required fields.");
        }

        return productService.updateSizeStock(id, sizeType, size, stock);
    }
}
