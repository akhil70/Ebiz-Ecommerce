package com.ebiz.backend.service;

import com.ebiz.backend.entity.Brand;
import com.ebiz.backend.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BrandService extends BaseService<Brand, String> {

    private final BrandRepository brandRepository;

    @Override
    protected MongoRepository<Brand, String> getRepository() {
        return brandRepository;
    }
}
