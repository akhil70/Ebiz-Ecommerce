package com.ebiz.backend.repository;

import com.ebiz.backend.entity.Subcategory;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SubcategoryRepository extends MongoRepository<Subcategory, String> {
    List<Subcategory> findByCategoryId(String categoryId);
}
