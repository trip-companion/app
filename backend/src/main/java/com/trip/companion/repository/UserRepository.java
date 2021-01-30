package com.trip.companion.repository;

import com.trip.companion.domain.user.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, Long> {

    Optional<User> findByJwtRefreshToken(String jwtRefreshToken);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

}
