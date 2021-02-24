package com.trip.companion.repository;

import com.trip.companion.domain.Feature;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FeatureRepository extends MongoRepository<Feature, String> {

    boolean existsAllByIdIn(List<String> featureList);

}
