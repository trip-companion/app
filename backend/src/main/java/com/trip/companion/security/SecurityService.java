package com.trip.companion.security;

import com.trip.companion.domain.user.User;
import com.trip.companion.error.exception.ActionForbiddenException;
import com.trip.companion.rest.controller.dto.request.LoginRequest;
import com.trip.companion.rest.controller.dto.response.LoginResponse;
import com.trip.companion.rest.controller.dto.response.RefreshRequest;
import com.trip.companion.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;

import static com.trip.companion.security.JwtService.TOKEN_TYPE;

@Service
@Slf4j
public class SecurityService {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;

    @Autowired
    public SecurityService(@Lazy AuthenticationManager authenticationManager, UserService userService,
                           JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    public LoginResponse setAuthenticationAndGenerateJwt(LoginRequest loginRequest) {
        Authentication authentication = authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = userService.setRefreshToken((User) authentication.getPrincipal());
        return getLoginResponse(user);
    }

    private Authentication authenticateUser(String username, String password) {
        return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }

    private LoginResponse getLoginResponse(User userWithRefreshToken) {
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setJwtAccessToken(jwtService.generateAccessToken(userWithRefreshToken));
        loginResponse.setJwtRefreshToken(userWithRefreshToken.getJwtRefreshToken());
        loginResponse.setJwtRefreshTokenExpireDate(userWithRefreshToken.getJwtRefreshTokenExpireDate().getTime());
        loginResponse.setTokenType(TOKEN_TYPE);
        return loginResponse;
    }

    public void setAuthenticationFromJwt(String jwt, HttpServletRequest request) {
        UserDetails userDetails = jwtService.getUserDetailsFromJwt(jwt);
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    public LoginResponse refreshToken(RefreshRequest refreshRequest) {
        User user = userService.getByRefreshToken(refreshRequest.getJwtRefreshToken());
        checkIsUserExpired(user);
        checkIsJwtRefreshTokenExpired(user);
        User userWithRefreshToken = userService.setRefreshToken(user);
        return getLoginResponse(userWithRefreshToken);
    }

    private void checkIsUserExpired(User user) {
        if (!user.isAccountNonExpired()) {
            throw new AccountExpiredException("User account is expired");
        }
    }

    private void checkIsJwtRefreshTokenExpired(User user) {
        if (user.getJwtRefreshTokenExpireDate().getTime() < System.currentTimeMillis()) {
            throw new ActionForbiddenException(String.format("Refresh token %s is expired", user.getJwtRefreshToken()));
        }
    }
}