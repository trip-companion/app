package com.trip.companion.service.error;

import com.trip.companion.config.RequestContext;
import com.trip.companion.domain.Language;
import com.trip.companion.domain.error.ErrorMessage;
import com.trip.companion.error.ErrorCode;
import com.trip.companion.repository.error.ErrorMessageRepository;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@SpringBootTest
class ErrorMessageServiceTest {

    @Autowired
    private ErrorMessageService errorMessageService;
    @MockBean
    private ErrorMessageRepository repository;
    @MockBean
    private RequestContext requestContext;

    @Test
    void assertErrorMessageReturnedByCode() {
        String expectedMessage = "displayMessage";

        ErrorMessage expectedErrorMessage = new ErrorMessage();
        expectedErrorMessage.setErrorCode(ErrorCode.AUTHENTICATION_ERROR);
        expectedErrorMessage.setLanguage(Language.UKR);
        expectedErrorMessage.setMessage(expectedMessage);

        ErrorMessage errorMessage = new ErrorMessage();
        errorMessage.setErrorCode(ErrorCode.AUTHENTICATION_ERROR);
        errorMessage.setLanguage(Language.ENG);

        when(requestContext.getLanguage()).thenReturn(Language.UKR);
        when(repository.findAllByErrorCode(ErrorCode.AUTHENTICATION_ERROR))
                .thenReturn(List.of(expectedErrorMessage, errorMessage));

        String message = errorMessageService.getDisplayMessageByErrorCode(ErrorCode.AUTHENTICATION_ERROR);
        assertEquals(expectedMessage, message);
    }

    @Test
    void assertDefaultErrorMessageReturnedByWrongCode() {
        when(requestContext.getLanguage()).thenReturn(Language.UKR);
        when(repository.findAllByErrorCode(ErrorCode.AUTHENTICATION_ERROR)).thenReturn(Collections.emptyList());

        String message = errorMessageService.getDisplayMessageByErrorCode(ErrorCode.AUTHENTICATION_ERROR);
        assertEquals(ErrorMessageService.DEFAULT_ERROR_MESSAGE, message);
    }

}