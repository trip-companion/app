package com.trip.companion.rest.dto.request;

import com.trip.companion.domain.user.LanguageLevel;
import com.trip.companion.validation.LanguageIsoCodeConstraint;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LanguageLevelItemRequest {

    @LanguageIsoCodeConstraint
    private String isoCode;
    @NotNull
    private LanguageLevel level;

}
