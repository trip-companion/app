package com.trip.companion.config;

import com.trip.companion.domain.Language;
import lombok.Data;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
@Data
public class RequestContext {

    private Language language;

}
