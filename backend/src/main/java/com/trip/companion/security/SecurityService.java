package com.trip.companion.security;

import com.trip.companion.domain.user.User;
import com.trip.companion.error.exception.auth.InvalidRefreshTokenException;
import com.trip.companion.rest.dto.request.auth.LoginRequest;
import com.trip.companion.rest.dto.response.auth.AccessTokenRefreshRequest;
import com.trip.companion.rest.dto.response.auth.LoginResponse;
import com.trip.companion.service.UserService;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import static com.trip.companion.security.JwtService.TOKEN_TYPE;
import static java.lang.String.format;

@Slf4j
public class SecurityService {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;

    public SecurityService(AuthenticationManager authenticationManager, UserService userService,
                           JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    public LoginResponse setAuthenticationAndGenerateJwt(LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        authenticateUser(email, loginRequest.getPassword());
        User user = userService.setRefreshToken(userService.getByEmail(email));
        log.info("User with email {} authenticated", email);
        return getLoginResponse(user);
    }

    private void authenticateUser(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
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
        log.debug("Authorized user with email {}", userDetails.getUsername());
    }

    public LoginResponse refreshAccessToken(AccessTokenRefreshRequest accessTokenRefreshRequest) {
        User user = userService.findByRefreshToken(accessTokenRefreshRequest.getJwtRefreshToken())
                .orElseThrow(() -> new InvalidRefreshTokenException("Wrong refresh token"));
        checkIsJwtRefreshTokenExpired(user);
        User userWithRefreshToken = userService.setRefreshToken(user);
        return getLoginResponse(userWithRefreshToken);
    }

    private void checkIsJwtRefreshTokenExpired(User user) {
        if (user.getJwtRefreshTokenExpireDate().getTime() < System.currentTimeMillis()) {
            throw new InvalidRefreshTokenException(format("Refresh token %s is expired", user.getJwtRefreshToken()));
        }
    }
}