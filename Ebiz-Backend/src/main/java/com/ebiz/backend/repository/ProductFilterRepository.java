package com.ebiz.backend.repository;

import com.ebiz.backend.entity.ProductFilter;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductFilterRepository extends MongoRepository<ProductFilter, String> {
}
