package com.trip.companion.rest.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@NoArgsConstructor
public class LanguageResponse {

    private String isoCode;
    private String displayName;

}
