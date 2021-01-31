package com.trip.companion.rest.controller.dto.request;

import lombok.Data;

import javax.validation.constraints.NotEmpty;

@Data
public class UserRequest {

    @NotEmpty
    private String email;
    @NotEmpty
    private String firstName;
    @NotEmpty
    private String lastName;
    @NotEmpty
    private String password;

}
