package com.trip.companion.rest.controller;

import com.trip.companion.config.RequestContext;
import com.trip.companion.rest.dto.response.FeatureResponse;
import com.trip.companion.service.FeatureService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/public/features")
public class FeatureController {

    private final FeatureService featureService;
    private final RequestContext requestContext;

    @Autowired
    public FeatureController(FeatureService featureService, RequestContext requestContext) {
        this.featureService = featureService;
        this.requestContext = requestContext;
    }

    @GetMapping
    public List<FeatureResponse> getFeatures() {
        return featureService.findAll().stream()
                .map(interest -> FeatureResponse.builder()
                        .id(interest.getId())
                        .displayName(interest.getDisplayName(requestContext.getLanguage()))
                        .build())
                .collect(Collectors.toList());
    }

}
