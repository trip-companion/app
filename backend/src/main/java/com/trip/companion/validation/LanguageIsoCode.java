package com.trip.companion.validation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import javax.validation.Constraint;
import javax.validation.Payload;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = LanguageIsoCodeConstraintValidator.class)
public @interface LanguageIsoCode {
    String message() default "Invalid language isoCode";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}