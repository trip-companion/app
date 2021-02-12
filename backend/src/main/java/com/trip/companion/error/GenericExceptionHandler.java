package com.trip.companion.error;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trip.companion.error.dto.ErrorResponse;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.internal.engine.ConstraintViolationImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@ControllerAdvice
@Slf4j
public class GenericExceptionHandler {

    private final ObjectMapper objectMapper;

    @Autowired
    public GenericExceptionHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleAuthException(AuthenticationException exc, HttpServletRequest request) {
        log.info("Unauthorized exception {}", exc.getMessage());
        return new ResponseEntity<>(new ErrorResponse(exc, request), UNAUTHORIZED);
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException exc,
                                                                   HttpServletRequest request) {
        ConstraintViolationImpl<?> violation = exc.getBindingResult().getAllErrors().stream()
                .findAny()
                .orElse(new ObjectError(exc.getBindingResult().getObjectName(), "Validation error"))
                .unwrap(ConstraintViolationImpl.class);
        String errorMessage = String.format("%s: %s", violation.getPropertyPath(), violation.getMessage());
        return new ResponseEntity<>(new ErrorResponse(errorMessage, request), HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleException(Exception exc, HttpServletRequest request) {
        log.error("Unhandled exception {}", exc.getMessage(), exc);
        return new ResponseEntity<>(new ErrorResponse(exc, request), INTERNAL_SERVER_ERROR);
    }

    public void handleAuthExceptionFromFilter(AuthenticationException exc, HttpServletRequest req,
                                              HttpServletResponse res) throws IOException {
        log.debug("Authentication exception with message {} during request to {}", exc.getMessage(),
                req.getServletPath());
        log.trace(exc.getMessage(), exc);
        handleExceptionFromFilter(req, res, exc, UNAUTHORIZED);
    }

    public void handleExceptionFromFilter(Exception exc, HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        log.info("Unhandled exception with message {} during request to {}", exc.getMessage(),
                req.getServletPath(), exc);
        handleExceptionFromFilter(req, res, exc, INTERNAL_SERVER_ERROR);
    }

    private void handleExceptionFromFilter(HttpServletRequest request, HttpServletResponse response, Exception exc,
                                           HttpStatus status) throws IOException {
        response.setStatus(status.value());
        response.setContentType(APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(new ErrorResponse(exc, request)));
    }
}