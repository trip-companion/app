package com.trip.companion.validation;

import com.trip.companion.utils.PasswordUtils;
import javax.validation.ConstraintValidatorContext;
import javax.validation.ConstraintValidatorContext.ConstraintViolationBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class PasswordConstraintValidatorTest {
    private final PasswordConstraintValidator validator = new PasswordConstraintValidator();
    private final ConstraintValidatorContext context = mock(ConstraintValidatorContext.class);
    private final ConstraintViolationBuilder violationBuilder = mock(ConstraintViolationBuilder.class);

    @BeforeEach
    void init() {
        when(context.buildConstraintViolationWithTemplate(anyString())).thenReturn(violationBuilder);
    }

    @ParameterizedTest
    @CsvSource({
            "Sh12!,Password must be 8 or more characters in length.",
            "Sh12!яяя,Password contains the illegal character 'я'.",
            "Sh12!    a,Password contains the illegal character ' '.",
            "sh12!aaaa,Password must contain 1 or more uppercase characters.",
            "SSH12!AAAA,Password must contain 1 or more lowercase characters.",
            "Shbb!aaaa,Password must contain 1 or more digit characters.",
            "Sh12caaaa,Password must contain 1 or more special characters."
    })
    void assertNotValidOnWrongPassword(String password, String message) {
        assertFalse(validator.isValid(password, context));
        verify(context, times(1)).disableDefaultConstraintViolation();
        verify(context, times(1)).buildConstraintViolationWithTemplate(message);
        verify(violationBuilder, times(1)).addConstraintViolation();
    }

    @Test
    void assertValidOnCorrectPassword() {
        assertTrue(validator.isValid(PasswordUtils.generatePassword(), context));
        verify(context, times(0)).disableDefaultConstraintViolation();
        verify(context, times(0)).buildConstraintViolationWithTemplate(anyString());
        verify(violationBuilder, times(0)).addConstraintViolation();
    }

}