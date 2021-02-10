package com.trip.companion.error.dto;

import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@NoArgsConstructor
public class ErrorResponse {

    private Date timeStamp;
    private int status;
    private String error;
    private String message;
    private String path;

    public ErrorResponse(Exception exc, HttpServletRequest request, HttpStatus httpStatus) {
        this.timeStamp = new Date();
        this.status = httpStatus.value();
        this.error = httpStatus.name();
        this.message = exc.getMessage();
        this.path = request.getServletPath();
    }
}
