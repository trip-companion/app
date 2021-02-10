package com.trip.companion.filter;

import com.trip.companion.error.GenericExceptionHandler;
import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.BadCredentialsException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
class ExceptionHandlerFilterTest {

    @Autowired
    private ExceptionHandlerFilter exceptionHandlerFilter;
    @MockBean
    private GenericExceptionHandler exceptionHandler;

    @Test
    void verifyHandlerCalledOnAuthException() throws IOException, ServletException {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        doThrow(BadCredentialsException.class).when(chain).doFilter(request, response);

        exceptionHandlerFilter.doFilterInternal(request, response, chain);

        verify(exceptionHandler, times(1))
                .handleAuthExceptionFromFilter(any(BadCredentialsException.class), eq(request), eq(response));
    }

    @Test
    void verifyHandlerCalledOnException() throws IOException, ServletException {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        doThrow(RuntimeException.class).when(chain).doFilter(request, response);

        exceptionHandlerFilter.doFilterInternal(request, response, chain);

        verify(exceptionHandler, times(1))
                .handleExceptionFromFilter(any(RuntimeException.class), eq(request), eq(response));
    }
}