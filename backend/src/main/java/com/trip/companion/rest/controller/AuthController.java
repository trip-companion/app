package com.trip.companion.rest.controller;

import com.trip.companion.rest.dto.request.auth.LoginRequest;
import com.trip.companion.rest.dto.response.auth.AccessTokenRefreshRequest;
import com.trip.companion.rest.dto.response.auth.LoginResponse;
import com.trip.companion.security.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/auth")
public class AuthController {

    private final SecurityService securityService;

    @Autowired
    public AuthController(SecurityService securityService) {
        this.securityService = securityService;
    }

    @PostMapping
    public LoginResponse generateAccessToken(@RequestBody LoginRequest loginRequest) {
        return securityService.setAuthenticationAndGenerateJwt(loginRequest);
    }

    @PostMapping("refresh")
    public LoginResponse refreshAccessToken(@RequestBody AccessTokenRefreshRequest accessTokenRefreshRequest) {
        return securityService.refreshAccessToken(accessTokenRefreshRequest);
    }

}