package com.trip.companion.repository;

import com.trip.companion.domain.Skill;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SkillRepository extends MongoRepository<Skill, String> {

    boolean existsAllByIdIn(List<String> idList);

}
