package com.ebiz.backend.repository;

import com.ebiz.backend.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    java.util.List<User> findByRole(String role);
    java.util.List<User> findByRoleAndIsActiveFalse(String role);
}
