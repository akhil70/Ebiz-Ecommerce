package com.ebiz.backend.service;

import com.ebiz.backend.entity.Product;
import com.ebiz.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService extends BaseService<Product, String> {

    private final ProductRepository productRepository;
    private final org.springframework.data.mongodb.core.MongoTemplate mongoTemplate;

    @Override
    protected MongoRepository<Product, String> getRepository() {
        return productRepository;
    }

    public java.util.List<Product> fetchProducts(java.util.Map<String, String> filters) {
        org.springframework.data.mongodb.core.query.Query query = new org.springframework.data.mongodb.core.query.Query();

        if (filters != null && !filters.isEmpty()) {
            filters.forEach((key, value) -> {
                if ("isFeatured".equals(key)) {
                    query.addCriteria(org.springframework.data.mongodb.core.query.Criteria.where("isFeatured")
                            .is(Boolean.parseBoolean(value)));
                } else if ("isNewArrival".equals(key)) {
                    query.addCriteria(org.springframework.data.mongodb.core.query.Criteria.where("isNewArrival")
                            .is(Boolean.parseBoolean(value)));
                } else if ("categoryId".equals(key)) {
                    query.addCriteria(
                            org.springframework.data.mongodb.core.query.Criteria.where("categoryId").is(value));
                } else if ("brandId".equals(key)) {
                    query.addCriteria(org.springframework.data.mongodb.core.query.Criteria.where("brandId").is(value));
                } else if ("status".equals(key)) {
                    query.addCriteria(org.springframework.data.mongodb.core.query.Criteria.where("status")
                            .is(Integer.parseInt(value)));
                } else {
                    query.addCriteria(
                            org.springframework.data.mongodb.core.query.Criteria.where("attributes." + key).is(value));
                }
            });
        }

        // Default to active products if status is not explicitly requested
        if (filters == null || !filters.containsKey("status")) {
            query.addCriteria(org.springframework.data.mongodb.core.query.Criteria.where("status").is(1));
        }

        return mongoTemplate.find(query, Product.class);
    }

    public boolean isSizeInStock(String productId, String sizeType, String size) {
        Product product = findById(productId).orElse(null);
        if (product == null || product.getSizeStocks() == null) {
            return false;
        }

        for (Product.SizeStock stock : product.getSizeStocks()) {
            if (stock.getSizeType() != null && stock.getSizeType().equals(sizeType) &&
                    stock.getSize() != null && stock.getSize().equals(size)) {
                return stock.getStock() != null && stock.getStock() > 0;
            }
        }
        return false;
    }

    public Product updateSizeStock(String productId, String sizeType, String size, Integer stockCount) {
        Product product = findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getSizeStocks() == null) {
            product.setSizeStocks(new java.util.ArrayList<>());
        }

        boolean found = false;
        for (Product.SizeStock stock : product.getSizeStocks()) {
            if (stock.getSizeType() != null && stock.getSizeType().equals(sizeType) &&
                    stock.getSize() != null && stock.getSize().equals(size)) {
                stock.setStock(stockCount);
                found = true;
                break;
            }
        }

        if (!found) {
            Product.SizeStock newStock = new Product.SizeStock(sizeType, size, stockCount);
            product.getSizeStocks().add(newStock);
        }

        return save(product);
    }
}
