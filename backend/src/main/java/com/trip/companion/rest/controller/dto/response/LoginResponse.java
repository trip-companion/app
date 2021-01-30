package com.trip.companion.rest.controller.dto.response;

import lombok.Data;

@Data
public class LoginResponse {

    private String jwtAccessToken;
    private String jwtRefreshToken;
    private Long jwtRefreshTokenExpireDate;
    private String tokenType;

}