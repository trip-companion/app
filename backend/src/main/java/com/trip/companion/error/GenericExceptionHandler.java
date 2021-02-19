package com.trip.companion.error;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trip.companion.error.dto.ErrorResponse;
import com.trip.companion.error.exception.client.ClientException;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.internal.engine.ConstraintViolationImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@ControllerAdvice
@Slf4j
public class GenericExceptionHandler {

    private final ObjectMapper objectMapper;
    private final ErrorResponseFactory responseFactory;

    @Autowired
    public GenericExceptionHandler(ObjectMapper objectMapper, ErrorResponseFactory responseFactory) {
        this.objectMapper = objectMapper;
        this.responseFactory = responseFactory;
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleAuthException(AuthenticationException exc) {
        log.info("Unauthorized exception {}", exc.getMessage());
        return new ResponseEntity<>(responseFactory.getErrorResponse(exc.getMessage()), UNAUTHORIZED);
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException exc) {
        ConstraintViolationImpl<?> violation = exc.getBindingResult().getAllErrors().stream()
                .findAny()
                .orElse(new ObjectError(exc.getBindingResult().getObjectName(), "Validation error"))
                .unwrap(ConstraintViolationImpl.class);
        String errorMessage = String.format("%s: %s", violation.getPropertyPath(), violation.getMessage());
        return new ResponseEntity<>(responseFactory.getErrorResponse(errorMessage), HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleClientException(ClientException exc) {
        ErrorResponse errorResponse = responseFactory.getErrorResponse(exc.getMessage(), exc.getErrorCode());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleException(Exception exc) {
        log.error("Unhandled exception {}", exc.getMessage(), exc);
        ErrorResponse errorResponse = responseFactory.getErrorResponse(exc.getMessage());
        return new ResponseEntity<>(errorResponse, INTERNAL_SERVER_ERROR);
    }

    public void handleAuthExceptionFromFilter(AuthenticationException exc, HttpServletRequest req,
                                              HttpServletResponse res) throws IOException {
        log.debug("Authentication exception with message {} during request to {}", exc.getMessage(),
                req.getServletPath());
        log.trace(exc.getMessage(), exc);
        handleExceptionFromFilter(res, UNAUTHORIZED, responseFactory.getAuthErrorResponse(exc.getMessage()));
    }

    public void handleExceptionFromFilter(Exception exc, HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        log.info("Unhandled exception with message {} during request to {}", exc.getMessage(),
                req.getServletPath(), exc);
        handleExceptionFromFilter(res, INTERNAL_SERVER_ERROR, responseFactory.getErrorResponse(exc.getMessage()));
    }

    private void handleExceptionFromFilter(HttpServletResponse response, HttpStatus status,
                                           ErrorResponse errorResponse) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}