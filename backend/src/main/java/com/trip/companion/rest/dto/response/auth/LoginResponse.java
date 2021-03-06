package com.trip.companion.rest.dto.response.auth;

import lombok.Data;

@Data
public class LoginResponse {

    private String jwtAccessToken;
    private String jwtRefreshToken;
    private Long jwtRefreshTokenExpireDate;
    private String tokenType;

}