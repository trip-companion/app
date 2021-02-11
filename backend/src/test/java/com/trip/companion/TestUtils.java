package com.trip.companion;

import com.trip.companion.security.JwtService;
import com.trip.companion.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TestUtils {

    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserService userService;

    public String getJwtAccessToken() {
        return getJwtAccessToken("testUser@gmail.com");
    }

    public String getJwtAccessToken(String email) {
        return JwtService.TOKEN_TYPE + jwtService.generateAccessToken(userService.getByEmail(email));
    }

}
