package com.trip.companion.rest.controller.auth.dto.response;

import lombok.Data;

@Data
public class RefreshRequest {

    private String jwtRefreshToken;

}