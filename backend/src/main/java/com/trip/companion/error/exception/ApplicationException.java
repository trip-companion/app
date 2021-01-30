package com.trip.companion.error.exception;

public class ApplicationException extends RuntimeException {

    public ApplicationException(String message) {
        super(message);
    }

    public ApplicationException(String message, Throwable exc) {
        super(message, exc);
    }
}
