package com.trip.companion.security;

import com.trip.companion.error.GenericExceptionHandler;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

@Slf4j
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final GenericExceptionHandler exceptionHandler;

    public JwtAuthenticationEntryPoint(GenericExceptionHandler exceptionHandler) {
        this.exceptionHandler = exceptionHandler;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException exc)
            throws IOException {
        exceptionHandler.handleAuthExceptionFromFilter(exc, request, response);
    }
}