package com.ebiz.backend.service;

import com.ebiz.backend.entity.Subcategory;
import com.ebiz.backend.repository.SubcategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubcategoryService extends BaseService<Subcategory, String> {

    private final SubcategoryRepository subcategoryRepository;

    @Override
    protected MongoRepository<Subcategory, String> getRepository() {
        return subcategoryRepository;
    }
}
