package com.trip.companion.rest.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trip.companion.EmbeddedMongoDbTest;
import com.trip.companion.error.dto.ErrorResponse;
import com.trip.companion.rest.controller.dto.request.LoginRequest;
import com.trip.companion.rest.controller.dto.response.LoginResponse;
import com.trip.companion.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
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

    @Value("${jwt.refreshTokenExpirationInMs}")
    private Long jwtRefreshTokenExpirationInMs;

    @Test
    void assertJwtGenerated() throws Exception {
        String expectedEmail = "testUser@gmail.com";
        String expectedTokenType = "Bearer ";
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(expectedEmail);
        loginRequest.setPassword("12345678");
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
        assertEquals(expectedEmail, userService.findByRefreshToken(loginResponse.getJwtRefreshToken()).orElseThrow()
                .getEmail());
        assertTrue(loginResponse.getJwtRefreshTokenExpireDate() - beforeRequestTime > jwtRefreshTokenExpirationInMs);
    }

    @Test
    void assertUnprocessableStatusOnInvalidRequest() throws Exception {
        String expectedErrorMessage = "password: must not be blank";

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("testUser@gmail.com");

        MockHttpServletResponse response = mockMvc.perform(post("/api/public/auth")
                .content(objectMapper.writeValueAsBytes(loginRequest))
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        ErrorResponse errorResponse = objectMapper.readValue(response.getContentAsString(), ErrorResponse.class);

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY.value(), response.getStatus());
        assertEquals(expectedErrorMessage, errorResponse.getMessage());
    }
}