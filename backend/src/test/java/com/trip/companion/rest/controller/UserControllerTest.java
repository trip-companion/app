package com.trip.companion.rest.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trip.companion.EmbeddedMongoDbTest;
import com.trip.companion.TestUtils;
import com.trip.companion.error.dto.ErrorResponse;
import com.trip.companion.rest.controller.dto.response.UserResponse;
import com.trip.companion.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
@EmbeddedMongoDbTest
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private TestUtils testUtils;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void verifyUserReturnedWithAuthHeader() throws Exception {
        String expectedEmail = "testUser@gmail.com";

        MockHttpServletResponse response = mockMvc.perform(get("/api/user/current")
                .header(HttpHeaders.AUTHORIZATION, testUtils.getJwtAccessToken(expectedEmail))
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        UserResponse userResponse = objectMapper.readValue(response.getContentAsString(), UserResponse.class);

        assertEquals(expectedEmail, userResponse.getEmail());
    }

    @Test
    void verifyUnauthorizedStatusWithoutToken() throws Exception {
        String expectedMessage = "Full authentication is required to access this resource";

        MockHttpServletResponse response = mockMvc.perform(get("/api/user/current")
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        ErrorResponse errorResponse = objectMapper.readValue(response.getContentAsString(), ErrorResponse.class);

        assertEquals(HttpStatus.UNAUTHORIZED.value(), response.getStatus());
        assertEquals(expectedMessage, errorResponse.getMessage());
        assertNotNull(errorResponse.getPath());
        assertNotNull(errorResponse.getMessage());
    }

    @Test
    void verifyUnauthorizedStatusWithWrongToken() throws Exception {
        String expectedMessage = "Wrong JWT token";

        MockHttpServletResponse response = mockMvc.perform(get("/api/user/current")
                .header(HttpHeaders.AUTHORIZATION, JwtService.TOKEN_TYPE + "test")
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        ErrorResponse errorResponse = objectMapper.readValue(response.getContentAsString(), ErrorResponse.class);

        assertEquals(HttpStatus.UNAUTHORIZED.value(), response.getStatus());
        assertEquals(expectedMessage, errorResponse.getMessage());
        assertNotNull(errorResponse.getPath());
        assertNotNull(errorResponse.getMessage());
    }
}