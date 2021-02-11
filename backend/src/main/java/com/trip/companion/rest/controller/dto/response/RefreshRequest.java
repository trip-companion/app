package com.trip.companion.rest.controller.dto.response;

import javax.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class RefreshRequest {
    @NotEmpty
    private String jwtRefreshToken;
}