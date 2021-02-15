package com.trip.companion.rest.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trip.companion.EmbeddedMongoDbTest;
import com.trip.companion.domain.user.User;
import com.trip.companion.error.dto.ErrorResponse;
import com.trip.companion.repository.UserRepository;
import com.trip.companion.repository.migration.test.CreateUserChangelog;
import com.trip.companion.rest.controller.dto.request.LoginRequest;
import com.trip.companion.rest.controller.dto.response.AccessTokenRefreshRequest;
import com.trip.companion.rest.controller.dto.response.LoginResponse;
import com.trip.companion.service.UserService;
import java.util.Date;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;

import static com.trip.companion.repository.migration.test.CreateUserChangelog.TEST_USER_EMAIL;
import static com.trip.companion.repository.migration.test.CreateUserChangelog.TEST_USER_PASSWORD;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
@AutoConfigureMockMvc
@EmbeddedMongoDbTest
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @Value("${jwt.refreshTokenExpirationInMs}")
    private Long jwtRefreshTokenExpirationInMs;

    @Test
    void assertJwtGenerated() throws Exception {
        String expectedTokenType = "Bearer ";
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(TEST_USER_EMAIL);
        loginRequest.setPassword(CreateUserChangelog.TEST_USER_PASSWORD);
        long beforeRequestTime = System.currentTimeMillis();
        MockHttpServletResponse response = mockMvc.perform(post("/api/public/auth")
                .content(objectMapper.writeValueAsBytes(loginRequest))
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        LoginResponse loginResponse = objectMapper.readValue(response.getContentAsString(), LoginResponse.class);

        assertEquals(HttpStatus.OK.value(), response.getStatus());
        assertNotNull(loginResponse.getJwtAccessToken());
        assertEquals(expectedTokenType, loginResponse.getTokenType());
        assertNotNull(loginResponse.getJwtRefreshToken());
        assertEquals(TEST_USER_EMAIL, userService.findByRefreshToken(loginResponse.getJwtRefreshToken()).orElseThrow()
                .getEmail());
        assertTrue(loginResponse.getJwtRefreshTokenExpireDate() - beforeRequestTime > jwtRefreshTokenExpirationInMs);
    }

    @Test
    void assertUnauthorizedReturnedOnWrongPassword() throws Exception {
        String expectedErrorMessage = "Bad credentials";
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(TEST_USER_EMAIL);
        loginRequest.setPassword("wrongPassword");
        MockHttpServletResponse response = mockMvc.perform(post("/api/public/auth")
                .content(objectMapper.writeValueAsBytes(loginRequest))
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        ErrorResponse errorResponse = objectMapper.readValue(response.getContentAsString(), ErrorResponse.class);

        assertEquals(HttpStatus.UNAUTHORIZED.value(), response.getStatus());
        assertEquals(expectedErrorMessage, errorResponse.getMessage());
    }

    @Test
    void assertUnauthorizedReturnedOnWrongEmail() throws Exception {
        String expectedErrorMessage = "Bad credentials";
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("wrongEmail");
        loginRequest.setPassword(TEST_USER_PASSWORD);
        MockHttpServletResponse response = mockMvc.perform(post("/api/public/auth")
                .content(objectMapper.writeValueAsBytes(loginRequest))
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        ErrorResponse errorResponse = objectMapper.readValue(response.getContentAsString(), ErrorResponse.class);

        assertEquals(HttpStatus.UNAUTHORIZED.value(), response.getStatus());
        assertEquals(expectedErrorMessage, errorResponse.getMessage());
    }

    @Test
    void assertUnprocessableStatusOnInvalidRequest() throws Exception {
        String expectedErrorMessage = "password: must not be blank";

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(TEST_USER_EMAIL);

        MockHttpServletResponse response = mockMvc.perform(post("/api/public/auth")
                .content(objectMapper.writeValueAsBytes(loginRequest))
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        ErrorResponse errorResponse = objectMapper.readValue(response.getContentAsString(), ErrorResponse.class);

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY.value(), response.getStatus());
        assertEquals(expectedErrorMessage, errorResponse.getMessage());
    }

    @Test
    void assertAccessTokenRefreshed() throws Exception {
        String existingRefreshToken =
                userService.setRefreshToken(userService.getByEmail(TEST_USER_EMAIL)).getJwtRefreshToken();
        String expectedTokenType = "Bearer ";

        AccessTokenRefreshRequest request = new AccessTokenRefreshRequest();
        request.setJwtRefreshToken(existingRefreshToken);

        long beforeRequestTime = System.currentTimeMillis();

        MockHttpServletResponse response = mockMvc.perform(post("/api/public/auth/refresh")
                .content(objectMapper.writeValueAsBytes(request))
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        LoginResponse loginResponse = objectMapper.readValue(response.getContentAsString(), LoginResponse.class);

        assertNotNull(loginResponse.getJwtAccessToken());
        assertNotEquals(existingRefreshToken, loginResponse.getJwtRefreshToken());
        assertEquals(expectedTokenType, loginResponse.getTokenType());
        assertTrue(loginResponse.getJwtRefreshTokenExpireDate() - beforeRequestTime > jwtRefreshTokenExpirationInMs);
    }

    @Test
    void assertUnauthorizedOnWrongRefreshToken() throws Exception {
        String expectedErrorMessage = "Wrong refresh token";

        AccessTokenRefreshRequest request = new AccessTokenRefreshRequest();
        request.setJwtRefreshToken("wrongRefreshToken");

        MockHttpServletResponse response = mockMvc.perform(post("/api/public/auth/refresh")
                .content(objectMapper.writeValueAsBytes(request))
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        ErrorResponse errorResponse = objectMapper.readValue(response.getContentAsString(), ErrorResponse.class);

        assertEquals(HttpStatus.UNAUTHORIZED.value(), response.getStatus());
        assertEquals(expectedErrorMessage, errorResponse.getMessage());
    }

    @Test
    void assertUnprocessableErrorOnMissingRefreshToken() throws Exception {
        String expectedErrorMessage = "jwtRefreshToken: must not be empty";

        AccessTokenRefreshRequest request = new AccessTokenRefreshRequest();
        request.setJwtRefreshToken(null);

        MockHttpServletResponse response = mockMvc.perform(post("/api/public/auth/refresh")
                .content(objectMapper.writeValueAsBytes(request))
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        ErrorResponse errorResponse = objectMapper.readValue(response.getContentAsString(), ErrorResponse.class);

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY.value(), response.getStatus());
        assertEquals(expectedErrorMessage, errorResponse.getMessage());
    }

    @Test
    void assertUnauthorizedOnExpiredRefreshToken() throws Exception {
        User user = userService.setRefreshToken(userService.getByEmail(TEST_USER_EMAIL));
        user.setJwtRefreshTokenExpireDate(new Date(0));
        userRepository.save(user);

        String expectedErrorMessage = String.format("Refresh token %s is expired", user.getJwtRefreshToken());

        AccessTokenRefreshRequest request = new AccessTokenRefreshRequest();
        request.setJwtRefreshToken(user.getJwtRefreshToken());

        MockHttpServletResponse response = mockMvc.perform(post("/api/public/auth/refresh")
                .content(objectMapper.writeValueAsBytes(request))
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        ErrorResponse errorResponse = objectMapper.readValue(response.getContentAsString(), ErrorResponse.class);

        assertEquals(HttpStatus.UNAUTHORIZED.value(), response.getStatus());
        assertEquals(expectedErrorMessage, errorResponse.getMessage());
    }
}