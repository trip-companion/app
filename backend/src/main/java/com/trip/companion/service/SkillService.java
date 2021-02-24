package com.trip.companion.service;

import com.trip.companion.domain.Skill;
import com.trip.companion.repository.SkillRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SkillService {

    private final SkillRepository repository;

    @Autowired
    public SkillService(SkillRepository repository) {
        this.repository = repository;
    }

    public List<Skill> findAll() {
        return repository.findAll();
    }

    public boolean existsAllByIdIn(List<String> skillIdList) {
        return repository.existsAllByIdIn(skillIdList);
    }
}
