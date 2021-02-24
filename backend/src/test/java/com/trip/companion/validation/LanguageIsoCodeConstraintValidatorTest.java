package com.trip.companion.validation;

import javax.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static java.util.Arrays.stream;
import static java.util.Locale.ENGLISH;
import static java.util.Locale.getISOLanguages;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LanguageIsoCodeConstraintValidatorTest {

    private final LanguageIsoCodeConstraintValidator validator = new LanguageIsoCodeConstraintValidator();
    private final ConstraintValidatorContext context = Mockito.mock(ConstraintValidatorContext.class);

    @Test
    void assertNotValidOnNullValue() {
        assertFalse(validator.isValid(null, context));
    }

    @Test
    void assertNotValidOnEmptyString() {
        assertFalse(validator.isValid("", context));
    }

    @Test
    void assertNotValidOnWrongValue() {
        assertFalse(validator.isValid("abc", context));
    }

    @Test
    void assertValidOnLanguageIsoCode() {
        assertTrue(validator.isValid(stream(getISOLanguages()).findAny().orElse(ENGLISH.getLanguage()), context));
    }

}