package com.trip.companion.repository;

import com.trip.companion.domain.user.User;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, Long> {

    Optional<User> findByJwtRefreshToken(String jwtRefreshToken);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

}
