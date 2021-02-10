package com.trip.companion.filter;

import com.trip.companion.error.GenericExceptionHandler;
import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
@Slf4j
public class ExceptionHandlerFilter extends OncePerRequestFilter {

    private final GenericExceptionHandler exceptionHandler;

    @Autowired
    public ExceptionHandlerFilter(GenericExceptionHandler exceptionHandler) {
        this.exceptionHandler = exceptionHandler;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (AuthenticationException exc) {
            exceptionHandler.handleAuthExceptionFromFilter(exc, request, response);
        } catch (Exception exc) {
            exceptionHandler.handleExceptionFromFilter(exc, request, response);
        }
    }
}
