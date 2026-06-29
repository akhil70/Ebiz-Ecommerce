package com.ebiz.backend.service;

import com.ebiz.backend.entity.Product;
import com.ebiz.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class ProductService extends BaseService<Product, String> {

    private final ProductRepository productRepository;
    private final com.ebiz.backend.repository.UserRepository userRepository;
    private final org.springframework.data.mongodb.core.MongoTemplate mongoTemplate;
    private final org.springframework.amqp.rabbit.core.RabbitTemplate rabbitTemplate;

    @Override
    protected MongoRepository<Product, String> getRepository() {
        return productRepository;
    }

    @Override
    public Product save(Product product) {
        Product savedProduct = super.save(product);
        try {
            rabbitTemplate.convertAndSend(
                    com.ebiz.backend.config.RabbitMQConfig.SOCIAL_SYNC_EXCHANGE,
                    com.ebiz.backend.config.RabbitMQConfig.SOCIAL_SYNC_ROUTING_KEY,
                    savedProduct.getId()
            );
            log.info("Enqueued social sync message for product: {}", savedProduct.getId());
        } catch (Exception e) {
            log.error("Failed to enqueue social sync message for product: {}", savedProduct.getId(), e);
        }
        return savedProduct;
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

    public void populateSellerInfo(Product product) {
        if (product == null || product.getSellerId() == null) {
            return;
        }
        userRepository.findById(product.getSellerId()).ifPresent(user -> {
            product.setSellerName(user.getName());
            product.setSellerEmail(user.getEmail());
        });
    }

    public void populateSellerInfo(java.util.List<Product> products) {
        if (products == null || products.isEmpty()) {
            return;
        }
        java.util.Set<String> sellerIds = products.stream()
                .map(Product::getSellerId)
                .filter(java.util.Objects::nonNull)
                .collect(java.util.stream.Collectors.toSet());
        
        if (sellerIds.isEmpty()) {
            return;
        }

        java.util.List<com.ebiz.backend.entity.User> sellers = userRepository.findAllById(sellerIds);
        java.util.Map<String, com.ebiz.backend.entity.User> sellerMap = sellers.stream()
                .collect(java.util.stream.Collectors.toMap(com.ebiz.backend.entity.User::getId, java.util.function.Function.identity()));


        products.forEach(product -> {
            if (product.getSellerId() != null) {
                com.ebiz.backend.entity.User seller = sellerMap.get(product.getSellerId());
                if (seller != null) {
                    product.setSellerName(seller.getName());
                    product.setSellerEmail(seller.getEmail());
                }
            }
        });
    }
}

