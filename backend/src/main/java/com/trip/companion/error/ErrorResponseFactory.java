package com.trip.companion.error;

import com.trip.companion.error.dto.ErrorResponse;
import com.trip.companion.service.error.ErrorMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ErrorResponseFactory {

    private final ErrorMessageService errorMessageService;

    @Autowired
    public ErrorResponseFactory(ErrorMessageService errorMessageService) {
        this.errorMessageService = errorMessageService;
    }

    public ErrorResponse getAuthErrorResponse(String message) {
        return getErrorResponse(message, ErrorCode.AUTHENTICATION_ERROR);
    }

    public ErrorResponse getErrorResponse(String message) {
        return getErrorResponse(message, ErrorCode.INTERNAL_SERVER_ERROR);
    }

    public ErrorResponse getErrorResponse(String message, ErrorCode errorCode) {
        String displayMessage = errorMessageService.getDisplayMessageByErrorCode(errorCode);
        return new ErrorResponse(message, displayMessage);
    }
}
