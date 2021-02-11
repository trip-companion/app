package com.trip.companion.error.dto;

import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ErrorResponse {

    private Date timeStamp;
    private String message;
    private String path;

    public ErrorResponse(Exception exc, HttpServletRequest request) {
        this.timeStamp = new Date();
        this.message = exc.getMessage();
        this.path = request.getServletPath();
    }
}
