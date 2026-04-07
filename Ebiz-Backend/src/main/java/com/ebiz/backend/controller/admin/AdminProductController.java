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
