package com.ebiz.backend.service;

import com.ebiz.backend.entity.Category;
import com.ebiz.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Service;

import com.ebiz.backend.dto.CategoryWithSubcategoriesDto;
import com.ebiz.backend.repository.SubcategoryRepository;
import com.ebiz.backend.entity.Subcategory;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService extends BaseService<Category, String> {

    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;

    @Override
    protected MongoRepository<Category, String> getRepository() {
        return categoryRepository;
    }

    public List<CategoryWithSubcategoriesDto> getCategoriesWithSubcategories() {
        List<Category> activeCategories = findAll();
        return activeCategories.stream().map(category -> {
            List<Subcategory> subcategories = subcategoryRepository.findByCategoryId(category.getId());
            return CategoryWithSubcategoriesDto.builder()
                    .id(category.getId())
                    .name(category.getName())
                    .slug(category.getSlug())
                    .parentId(category.getParentId())
                    .image(category.getImage())
                    .description(category.getDescription())
                    .displayOrder(category.getDisplayOrder())
                    .status(category.getStatus())
                    .subcategory(subcategories)
                    .build();
        }).collect(Collectors.toList());
    }
}
