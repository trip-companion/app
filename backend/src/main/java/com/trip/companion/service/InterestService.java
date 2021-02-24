package com.trip.companion.service;

import com.trip.companion.domain.Interest;
import com.trip.companion.repository.InterestRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InterestService {

    private final InterestRepository repository;

    @Autowired
    public InterestService(InterestRepository repository) {
        this.repository = repository;
    }

    public List<Interest> findAll() {
        return repository.findAll();
    }

    public boolean existsAllByIdIn(List<String> interestIdList) {
        return repository.existsAllByIdIn(interestIdList);
    }
}
