package com.trip.companion.rest.advice;

import java.lang.reflect.Type;
import java.util.Set;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdviceAdapter;

@ControllerAdvice
public class ValidatingRequestBodyAdviceAdapter extends RequestBodyAdviceAdapter {

    private final Validator validator;

    @Autowired
    public ValidatingRequestBodyAdviceAdapter(Validator validator) {
        this.validator = validator;
    }

    @Override
    public boolean supports(MethodParameter methodParameter, Type targetType,
                            Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object afterBodyRead(Object body, HttpInputMessage inputMessage, MethodParameter parameter, Type targetType,
                                Class<? extends HttpMessageConverter<?>> converterType) {
        Set<ConstraintViolation<Object>> validationResult = validator.validate(body);
        if (!validationResult.isEmpty()) {
            throw new ConstraintViolationException(validationResult);
        }
        return super.afterBodyRead(body, inputMessage, parameter, targetType, converterType);
    }
}
