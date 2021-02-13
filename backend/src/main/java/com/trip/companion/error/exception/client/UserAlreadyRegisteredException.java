package com.trip.companion.error.exception.client;

import com.trip.companion.error.ErrorCode;

public class UserAlreadyRegisteredException extends ClientException {
    public UserAlreadyRegisteredException(String email) {
        super(String.format("User with email %s already registered", email), ErrorCode.USER_ALREADY_REGISTERED);
    }
}
