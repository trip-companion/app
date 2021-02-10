package com.trip.companion.security;

import com.trip.companion.error.exception.auth.InvalidJwtException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
class JwtAuthenticationFilterTest {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean
    private SecurityService securityService;

    @Test
    void verifySecurityServiceNotInvokedIfAuthHeaderMissing() throws ServletException, IOException {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(null);

        jwtAuthenticationFilter.doFilterInternal(request, response, chain);

        verify(securityService, times(0)).setAuthenticationFromJwt(anyString(), eq(request));
        verify(chain, times(1)).doFilter(request, response);
    }

    @Test
    void verifySecurityServiceInvokedIfAuthHeaderPresent() throws ServletException, IOException {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer aaa");

        jwtAuthenticationFilter.doFilterInternal(request, response, chain);

        verify(securityService, times(1)).setAuthenticationFromJwt(anyString(), eq(request));
        verify(chain, times(1)).doFilter(request, response);
    }

    @Test
    void assertInvalidJwtExceptionThrownOnTokenExpired() throws ServletException, IOException {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer aaa");
        doThrow(ExpiredJwtException.class).when(securityService).setAuthenticationFromJwt(anyString(), eq(request));

        assertThrows(InvalidJwtException.class,
                () -> jwtAuthenticationFilter.doFilterInternal(request, response, chain), "Expired JWT token");

        verify(chain, times(0)).doFilter(request, response);
    }

    @Test
    void assertInvalidJwtExceptionThrownOnInvalidExpired() throws ServletException, IOException {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer aaa");
        doThrow(JwtException.class).when(securityService).setAuthenticationFromJwt(anyString(), eq(request));

        assertThrows(InvalidJwtException.class,
                () -> jwtAuthenticationFilter.doFilterInternal(request, response, chain), "Wrong JWT token");

        verify(chain, times(0)).doFilter(request, response);
    }
}