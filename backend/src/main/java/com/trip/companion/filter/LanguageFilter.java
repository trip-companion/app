package com.trip.companion.filter;

import com.trip.companion.config.RequestContext;
import com.trip.companion.domain.Language;
import java.io.IOException;
import java.util.Arrays;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 3)
@Slf4j
public class LanguageFilter extends OncePerRequestFilter {
    static final String LANGUAGE_HEADER = "Language";

    @Autowired
    private RequestContext requestContext;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String languageHeader = request.getHeader(LANGUAGE_HEADER);
        Language language = Arrays.stream(Language.values())
                .filter(l -> l.name().equals(languageHeader))
                .findFirst()
                .orElse(Language.ENG);
        requestContext.setLanguage(language);
        filterChain.doFilter(request, response);
    }
}
