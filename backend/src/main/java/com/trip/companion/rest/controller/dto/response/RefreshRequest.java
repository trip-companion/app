package com.trip.companion.rest.controller.dto.response;

import lombok.Data;

@Data
public class RefreshRequest {

    private String jwtRefreshToken;

}