package com.ebiz.backend.repository;

import com.ebiz.backend.entity.GuestBuyer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GuestBuyerRepository extends MongoRepository<GuestBuyer, String> {
    Optional<GuestBuyer> findBySocialMediaHandleAndPlatform(String socialMediaHandle, String platform);
}
