package com.trip.companion.rest.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@NoArgsConstructor
public class FeatureResponse {

    private String id;
    private String displayName;

}
