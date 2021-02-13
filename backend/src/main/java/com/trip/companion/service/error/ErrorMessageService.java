package com.trip.companion.service.error;

import com.trip.companion.config.RequestContext;
import com.trip.companion.domain.error.ErrorMessage;
import com.trip.companion.error.ErrorCode;
import com.trip.companion.repository.error.ErrorMessageRepository;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ErrorMessageService {
    public static final String DEFAULT_ERROR_MESSAGE = "Error occurred during request";

    private final ErrorMessageRepository repository;
    private final RequestContext requestContext;

    @Autowired
    public ErrorMessageService(ErrorMessageRepository repository, RequestContext requestContext) {
        this.repository = repository;
        this.requestContext = requestContext;
    }

    public String getDisplayMessageByErrorCode(ErrorCode errorCode) {
        return findByErrorCodeAndLanguage(errorCode)
                .or(() -> findByErrorCodeAndLanguage(ErrorCode.INTERNAL_SERVER_ERROR))
                .map(ErrorMessage::getMessage)
                .orElse(DEFAULT_ERROR_MESSAGE);
    }

    private Optional<ErrorMessage> findByErrorCodeAndLanguage(ErrorCode errorCode) {
        return repository.findAllByErrorCode(errorCode).stream()
                .filter(errorMessage -> requestContext.getLanguage().equals(errorMessage.getLanguage()))
                .findAny();
    }
}
