package com.trip.companion.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final SecurityService securityService;

    @Autowired
    public JwtAuthenticationFilter(SecurityService securityService) {
        this.securityService = securityService;
    }

    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String bearerToken = request.getHeader(AUTHORIZATION);
        if (headerHasJwtToken(bearerToken)) {
            securityService.setAuthenticationFromJwt(getJwtFromRequest(bearerToken), request);
        }
        filterChain.doFilter(request, response);
    }

    private boolean headerHasJwtToken(String bearerToken) {
        return StringUtils.hasText(bearerToken) && bearerToken.startsWith(JwtService.TOKEN_TYPE);
    }

    private String getJwtFromRequest(String bearerToken) {
        return bearerToken.substring(JwtService.TOKEN_TYPE.length());
    }

}