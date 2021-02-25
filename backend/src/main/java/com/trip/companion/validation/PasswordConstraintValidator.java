package com.trip.companion.validation;

import com.google.common.base.Joiner;
import com.trip.companion.utils.PasswordUtils;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import org.passay.RuleResult;

public class PasswordConstraintValidator implements ConstraintValidator<Password, String> {

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        RuleResult result = PasswordUtils.validatePassword(password);
        if (result.isValid()) {
            return true;
        } else {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(Joiner.on(" ").join(
                    PasswordUtils.getPasswordValidationErrors(result))).addConstraintViolation();
            return false;
        }
    }
}
