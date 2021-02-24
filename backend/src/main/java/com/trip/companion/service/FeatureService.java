package com.trip.companion.service;

import com.trip.companion.domain.Feature;
import com.trip.companion.repository.FeatureRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FeatureService {

    private final FeatureRepository repository;

    @Autowired
    public FeatureService(FeatureRepository repository) {
        this.repository = repository;
    }

    public List<Feature> findAll() {
        return repository.findAll();
    }

    public boolean existsAllByIdIn(List<String> featureIdList) {
        return repository.existsAllByIdIn(featureIdList);
    }
}
