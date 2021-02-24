package com.trip.companion.rest.controller;

import com.trip.companion.config.RequestContext;
import com.trip.companion.rest.dto.response.LanguageResponse;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.apache.commons.lang3.StringUtils.capitalize;

@RestController
@RequestMapping("api/public/languages")
public class LanguageController {

    private final RequestContext context;

    @Autowired
    public LanguageController(RequestContext context) {
        this.context = context;
    }

    @GetMapping
    public List<LanguageResponse> getLanguages() {
        return Arrays.stream(Locale.getISOLanguages())
                .map(isoCode -> LanguageResponse.builder()
                        .isoCode(isoCode)
                        .displayName(capitalize(new Locale(isoCode).getDisplayName(context.getLocale())))
                        .build())
                .collect(Collectors.toList());
    }

}
