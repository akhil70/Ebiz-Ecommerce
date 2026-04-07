package com.ebiz.backend.controller.admin;

import com.ebiz.backend.controller.base.BaseController;
import com.ebiz.backend.entity.Category;
import com.ebiz.backend.service.BaseService;
import com.ebiz.backend.service.CategoryService;
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
import org.springframework.web.bind.annotation.GetMapping;
import com.ebiz.backend.dto.CategoryWithSubcategoriesDto;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController extends BaseController<Category, String> {

    private final CategoryService categoryService;
    private final ImageService imageService;

    @Override
    protected BaseService<Category, String> getService() {
        return categoryService;
    }

    @PostMapping("/with-image")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Category> createWithImage(
            @ModelAttribute Category entity,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            String imageUrl = imageService.saveImage(image);
            entity.setImage(imageUrl);
        }
        return ResponseEntity.ok(getService().save(entity));
    }

    @PutMapping("/{id}/with-image")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Category> updateWithImage(
            @PathVariable String id,
            @ModelAttribute Category entity,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        entity.setId(id);

        Category existingCategory = getService().findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (image != null && !image.isEmpty()) {
            if (existingCategory.getImage() != null) {
                imageService.deleteImage(existingCategory.getImage());
            }
            String imageUrl = imageService.saveImage(image);
            entity.setImage(imageUrl);
        } else {
            entity.setImage(existingCategory.getImage());
        }

        return ResponseEntity.ok(getService().save(entity));
    }


    @GetMapping("/with-subcategories")
    public ResponseEntity<List<CategoryWithSubcategoriesDto>> getCategoriesWithSubcategories() {
        return ResponseEntity.ok(categoryService.getCategoriesWithSubcategories());
    }
}
