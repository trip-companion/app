package com.trip.companion.rest.dto.response;

import com.trip.companion.domain.user.LanguageLevel;
import lombok.Data;

@Data
public class LanguageLevelItemResponse {

    private String isoCode;
    private LanguageLevel level;

}
