package com.ebiz.backend.repository;

import com.ebiz.backend.entity.OtpCode;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface OtpCodeRepository extends MongoRepository<OtpCode, String> {
    Optional<OtpCode> findByEmail(String email);

    void deleteByEmail(String email);
}
