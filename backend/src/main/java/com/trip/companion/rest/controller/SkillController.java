package com.trip.companion.rest.controller;

import com.trip.companion.config.RequestContext;
import com.trip.companion.rest.dto.response.SkillResponse;
import com.trip.companion.service.SkillService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/skills")
public class SkillController {

    private final SkillService skillService;
    private final RequestContext requestContext;

    @Autowired
    public SkillController(SkillService skillService, RequestContext requestContext) {
        this.skillService = skillService;
        this.requestContext = requestContext;
    }

    @GetMapping
    public List<SkillResponse> getSkills() {
        return skillService.findAll().stream()
                .map(skill -> SkillResponse.builder()
                        .id(skill.getId())
                        .displayName(skill.getDisplayName(requestContext.getLanguage()))
                        .build())
                .collect(Collectors.toList());
    }

}
