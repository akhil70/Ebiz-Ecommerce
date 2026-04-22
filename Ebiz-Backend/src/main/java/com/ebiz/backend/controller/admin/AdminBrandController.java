package com.ebiz.backend.controller.admin;

import com.ebiz.backend.controller.base.BaseController;
import com.ebiz.backend.entity.Brand;
import com.ebiz.backend.service.BaseService;
import com.ebiz.backend.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.ebiz.backend.service.ImageService;

@RestController
@RequestMapping("/api/admin/brands")
@RequiredArgsConstructor
public class AdminBrandController extends BaseController<Brand, String> {

    private final BrandService brandService;
    private final ImageService imageService;

    @Override
    protected BaseService<Brand, String> getService() {
        return brandService;
    }

    @PostMapping("/with-image")
    public ResponseEntity<Brand> createWithImage(
            @ModelAttribute Brand entity,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            String imageUrl = imageService.saveImage(image);
            entity.setLogo(imageUrl);
        }
        return ResponseEntity.ok(getService().save(entity));
    }

    @PutMapping("/{id}/with-image")
    public ResponseEntity<Brand> updateWithImage(
            @PathVariable String id,
            @ModelAttribute Brand entity,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        entity.setId(id);

        Brand existingBrand = getService().findById(id).orElseThrow(() -> new RuntimeException("Brand not found"));

        if (image != null && !image.isEmpty()) {
            // Delete old image if it exists
            if (existingBrand.getLogo() != null) {
                imageService.deleteImage(existingBrand.getLogo());
            }
            String imageUrl = imageService.saveImage(image);
            entity.setLogo(imageUrl);
        } else {
            // retain existing image
            entity.setLogo(existingBrand.getLogo());
        }

        return ResponseEntity.ok(getService().save(entity));
    }
}
