package com.trip.companion.rest.dto.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class RegisterUserRequest {

    @Email
    private String email;
    @NotEmpty
    private String firstName;
    @NotEmpty
    private String lastName;
    @NotEmpty
    //TODO add custom validation
    private String password;

}
