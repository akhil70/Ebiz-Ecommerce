package com.ebiz.backend.service;

import com.ebiz.backend.entity.ProductFilter;
import com.ebiz.backend.repository.ProductFilterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductFilterService extends BaseService<ProductFilter, String> {

    private final ProductFilterRepository productFilterRepository;

    @Override
    protected MongoRepository<ProductFilter, String> getRepository() {
        return productFilterRepository;
    }
}
