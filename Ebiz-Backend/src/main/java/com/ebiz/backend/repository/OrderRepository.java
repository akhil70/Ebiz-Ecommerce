package com.ebiz.backend.repository;

import com.ebiz.backend.entity.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

import org.springframework.data.mongodb.repository.Query;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserId(String userId);

    @Query("{ 'items.sellerId': ?0 }")
    List<Order> findOrdersBySellerId(String sellerId);
}
