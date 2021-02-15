package com.trip.companion.error.exception.client;

import com.trip.companion.error.ErrorCode;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ClientException extends RuntimeException {

    private final ErrorCode errorCode;

    public ClientException(String message, ErrorCode errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}
