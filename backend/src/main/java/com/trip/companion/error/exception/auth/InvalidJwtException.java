package com.trip.companion.error.exception.auth;

import org.springframework.security.core.AuthenticationException;

public class InvalidJwtException extends AuthenticationException {
    public InvalidJwtException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
