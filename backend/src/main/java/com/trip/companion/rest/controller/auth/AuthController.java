package com.trip.companion.rest.controller.auth;

import com.trip.companion.rest.controller.auth.dto.request.LoginRequest;
import com.trip.companion.rest.controller.auth.dto.response.LoginResponse;
import com.trip.companion.rest.controller.auth.dto.response.RefreshRequest;
import com.trip.companion.security.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/public/auth")
public class AuthController {

    private final SecurityService securityService;

    @Autowired
    public AuthController(SecurityService securityService) {
        this.securityService = securityService;
    }

    @PostMapping
    public ResponseEntity<LoginResponse> generateJwt(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(securityService.setAuthenticationAndGenerateJwt(loginRequest));
    }

    @PostMapping("refresh")
    public ResponseEntity<LoginResponse> refreshToken(@Valid @RequestBody RefreshRequest refreshRequest) {
        return ResponseEntity.ok(securityService.refreshToken(refreshRequest));
    }

}