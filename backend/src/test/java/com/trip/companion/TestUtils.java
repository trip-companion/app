package com.trip.companion;

import com.trip.companion.security.JwtService;
import com.trip.companion.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import static com.trip.companion.repository.migration.test.CreateUserChangelog.TEST_USER_EMAIL;

@Component
public class TestUtils {

    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserService userService;

    public String getJwtAccessToken() {
        return getJwtAccessToken(TEST_USER_EMAIL);
    }

    public String getJwtAccessToken(String email) {
        return JwtService.TOKEN_TYPE + jwtService.generateAccessToken(userService.getByEmail(email));
    }

}
