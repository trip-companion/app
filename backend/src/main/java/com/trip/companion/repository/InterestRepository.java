package com.trip.companion.repository;

import com.trip.companion.domain.Interest;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface InterestRepository extends MongoRepository<Interest, String> {

    boolean existsAllByIdIn(List<String> idList);

}
