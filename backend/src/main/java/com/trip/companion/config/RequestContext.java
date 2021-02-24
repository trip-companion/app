package com.trip.companion.config;

import com.trip.companion.domain.Language;
import java.util.Locale;
import lombok.Data;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
@Data
public class RequestContext {

    private Language language;

    public Locale getLocale() {
        return this.language.getLocale();
    }

}
