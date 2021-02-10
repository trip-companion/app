package com.trip.companion.filter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Profile;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import static com.google.common.net.HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS;
import static com.google.common.net.HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS;
import static com.google.common.net.HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN;
import static com.google.common.net.HttpHeaders.ACCESS_CONTROL_MAX_AGE;
import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.OPTIONS;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;

@Component
@Profile("dev")
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CustomCorsFilter extends OncePerRequestFilter {

    private static final String MAX_AGE = "3600";
    private static final String ALLOWED_ORIGINS = "*";
    private static final String ALLOWED_HEADERS = "*";
    private static final List<HttpMethod> ALLOWED_METHODS = List.of(GET, POST, PUT, DELETE, OPTIONS);

    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {
        response.setHeader(ACCESS_CONTROL_ALLOW_ORIGIN, ALLOWED_ORIGINS);
        response.setHeader(ACCESS_CONTROL_ALLOW_METHODS, appendMethodsWithComa());
        response.setHeader(ACCESS_CONTROL_MAX_AGE, MAX_AGE);
        response.setHeader(ACCESS_CONTROL_ALLOW_HEADERS, ALLOWED_HEADERS);
        filterChain.doFilter(request, response);
    }

    private String appendMethodsWithComa() {
        return ALLOWED_METHODS.stream().map(HttpMethod::name).collect(Collectors.joining(", "));
    }
}
