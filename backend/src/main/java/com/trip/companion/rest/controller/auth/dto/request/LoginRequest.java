package com.trip.companion.rest.controller.auth.dto.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class LoginRequest {

    @NotBlank
    private String email;
    @NotBlank
    private String password;

}