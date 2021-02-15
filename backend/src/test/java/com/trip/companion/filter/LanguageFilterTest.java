package com.trip.companion.filter;

import com.trip.companion.config.RequestContext;
import com.trip.companion.domain.Language;
import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
class LanguageFilterTest {

    @Autowired
    private LanguageFilter languageFilter;
    @MockBean
    private RequestContext requestContext;

    @Test
    void assertLanguageSetIfHeaderPresent() throws ServletException, IOException {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        when(request.getHeader(LanguageFilter.LANGUAGE_HEADER)).thenReturn("UKR");

        languageFilter.doFilterInternal(request, response, chain);

        verify(requestContext, times(1)).setLanguage(Language.UKR);
        verify(chain, times(1)).doFilter(request, response);
    }

    @Test
    void assertEngLanguageSetIfHeaderMissing() throws ServletException, IOException {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        languageFilter.doFilterInternal(request, response, chain);

        verify(requestContext, times(1)).setLanguage(Language.ENG);
        verify(chain, times(1)).doFilter(request, response);
    }

}