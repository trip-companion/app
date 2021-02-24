package com.trip.companion.validation;

import java.util.List;
import java.util.Locale;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import org.springframework.util.StringUtils;

public class LanguageIsoCodeConstraintValidator implements ConstraintValidator<LanguageIsoCodeConstraint, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return StringUtils.hasText(value) && List.of(Locale.getISOLanguages()).contains(value);
    }
}
