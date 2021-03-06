package com.trip.companion.rest.dto.response.auth;

import javax.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class AccessTokenRefreshRequest {
    @NotEmpty
    private String jwtRefreshToken;
}