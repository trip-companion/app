package com.trip.companion.rest.dto.request.auth;

import javax.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class LoginRequest {

    @NotEmpty
    private String email;
    @NotEmpty
    private String password;

}