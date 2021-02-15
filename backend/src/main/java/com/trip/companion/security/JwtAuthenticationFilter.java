package com.trip.companion.security;

import com.trip.companion.error.exception.auth.InvalidJwtException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final SecurityService securityService;

    public JwtAuthenticationFilter(SecurityService securityService) {
        this.securityService = securityService;
    }

    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String bearerToken = request.getHeader(AUTHORIZATION);
        if (headerHasJwtToken(bearerToken)) {
            try {
                securityService.setAuthenticationFromJwt(getJwtFromRequest(bearerToken), request);
            } catch (ExpiredJwtException exc) {
                throw new InvalidJwtException("Expired JWT token", exc);
            } catch (JwtException exc) {
                throw new InvalidJwtException("Wrong JWT token", exc);
            }
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