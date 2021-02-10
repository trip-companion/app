package com.trip.companion.rest.controller;

import com.trip.companion.rest.controller.dto.request.LoginRequest;
import com.trip.companion.rest.controller.dto.response.LoginResponse;
import com.trip.companion.rest.controller.dto.response.RefreshRequest;
import com.trip.companion.security.SecurityService;
import javax.validation.Valid;
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
    public LoginResponse generateJwt(@Valid @RequestBody LoginRequest loginRequest) {
        return securityService.setAuthenticationAndGenerateJwt(loginRequest);
    }

    @PostMapping("refresh")
    public LoginResponse refreshToken(@Valid @RequestBody RefreshRequest refreshRequest) {
        return securityService.refreshToken(refreshRequest);
    }

}