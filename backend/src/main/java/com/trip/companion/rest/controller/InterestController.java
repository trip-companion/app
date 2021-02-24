package com.trip.companion.rest.controller;

import com.trip.companion.config.RequestContext;
import com.trip.companion.rest.dto.response.InterestResponse;
import com.trip.companion.service.InterestService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/public/interests")
public class InterestController {

    private final InterestService interestService;
    private final RequestContext requestContext;

    @Autowired
    public InterestController(InterestService interestService, RequestContext requestContext) {
        this.interestService = interestService;
        this.requestContext = requestContext;
    }

    @GetMapping
    public List<InterestResponse> getInterests() {
        return interestService.findAll().stream()
                .map(interest -> InterestResponse.builder()
                        .id(interest.getId())
                        .displayName(interest.getDisplayName(requestContext.getLanguage()))
                        .build())
                .collect(Collectors.toList());
    }

}
