package com.trip.companion.error.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Date;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    private Date timeStamp = new Date();
    private String message;
    private String displayMessage;

    public ErrorResponse(String message, String displayMessage) {
        this.message = message;
        this.displayMessage = displayMessage;
    }
}
