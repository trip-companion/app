package com.trip.companion.error;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trip.companion.EmbeddedMongoDbTest;
import com.trip.companion.error.dto.ErrorResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Objects;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
class GenericExceptionHandlerTest {

    @Autowired
    private GenericExceptionHandler genericExceptionHandler;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void handleAuthExceptionFromFilterTest() throws IOException {
        String exceptionMessage = "Bad credentials";
        String servletPath = "servletPath";
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        PrintWriter writer = mock(PrintWriter.class);
        AuthenticationException exception = new BadCredentialsException(exceptionMessage);

        when(request.getServletPath()).thenReturn(servletPath);
        when(response.getWriter()).thenReturn(writer);

        genericExceptionHandler.handleAuthExceptionFromFilter(exception, request, response);

        ArgumentCaptor<String> captor = ArgumentCaptor.forClass(String.class);
        verify(writer, times(1)).write(captor.capture());
        ErrorResponse capturedErrorResponse = objectMapper.readValue(captor.getValue(), ErrorResponse.class);

        verify(response, times(1)).setStatus(HttpStatus.UNAUTHORIZED.value());
        assertNotNull(capturedErrorResponse.getTimeStamp());
        assertEquals(exceptionMessage, capturedErrorResponse.getMessage());
        assertEquals(servletPath, capturedErrorResponse.getPath());
    }

    @Test
    void handleExceptionFromFilterTest() throws IOException {
        String exceptionMessage = "Runtime exception";
        String servletPath = "servletPath";
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        PrintWriter writer = mock(PrintWriter.class);
        RuntimeException exception = new RuntimeException(exceptionMessage);

        when(request.getServletPath()).thenReturn(servletPath);
        when(response.getWriter()).thenReturn(writer);

        genericExceptionHandler.handleExceptionFromFilter(exception, request, response);

        ArgumentCaptor<String> captor = ArgumentCaptor.forClass(String.class);
        verify(writer, times(1)).write(captor.capture());
        ErrorResponse capturedErrorResponse = objectMapper.readValue(captor.getValue(), ErrorResponse.class);

        verify(response, times(1)).setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        assertNotNull(capturedErrorResponse.getTimeStamp());
        assertEquals(exceptionMessage, capturedErrorResponse.getMessage());
        assertEquals(servletPath, capturedErrorResponse.getPath());
    }

    @Test
    void handleAuthExceptionTest() {
        String exceptionMessage = "exceptionMessage";
        String servletPath = "servletPath";
        HttpServletRequest request = mock(HttpServletRequest.class);
        AuthenticationException exception = new BadCredentialsException(exceptionMessage);

        when(request.getServletPath()).thenReturn(servletPath);

        ResponseEntity<ErrorResponse> responseEntity = genericExceptionHandler.handleAuthException(exception, request);
        ErrorResponse errorResponse = responseEntity.getBody();

        assertTrue(Objects.nonNull(errorResponse));
        assertEquals(HttpStatus.UNAUTHORIZED, responseEntity.getStatusCode());
        assertNotNull(errorResponse.getTimeStamp());
        assertEquals(exceptionMessage, errorResponse.getMessage());
        assertEquals(servletPath, errorResponse.getPath());
    }

    @Test
    void handleExceptionTest() {
        String exceptionMessage = "exceptionMessage";
        String servletPath = "servletPath";
        HttpServletRequest request = mock(HttpServletRequest.class);
        RuntimeException exception = new RuntimeException(exceptionMessage);

        when(request.getServletPath()).thenReturn(servletPath);

        ResponseEntity<ErrorResponse> responseEntity = genericExceptionHandler.handleException(exception, request);
        ErrorResponse errorResponse = responseEntity.getBody();

        assertTrue(Objects.nonNull(errorResponse));
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, responseEntity.getStatusCode());
        assertNotNull(errorResponse.getTimeStamp());
        assertEquals(exceptionMessage, errorResponse.getMessage());
        assertEquals(servletPath, errorResponse.getPath());
    }

}