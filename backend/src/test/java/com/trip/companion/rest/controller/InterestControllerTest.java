package com.trip.companion.rest.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trip.companion.EmbeddedMongoDbTest;
import com.trip.companion.repository.InterestRepository;
import com.trip.companion.rest.dto.response.InterestResponse;
import java.util.List;
import java.util.Objects;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@AutoConfigureMockMvc
@EmbeddedMongoDbTest
class InterestControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private InterestRepository interestRepository;

    @Test
    void assertInterestsReturned() throws Exception {
        MockHttpServletResponse response =
                mockMvc.perform(MockMvcRequestBuilders.get("/api/public/interests"))
                        .andReturn().getResponse();

        List<InterestResponse> interestResponses = objectMapper.readValue(response.getContentAsString(),
                new TypeReference<>() {
                });

        assertFalse(interestResponses.isEmpty());
        assertEquals(interestRepository.findAll().size(), interestResponses.size());
        assertTrue(interestResponses.stream().map(InterestResponse::getId).allMatch(Objects::nonNull));
        assertTrue(interestResponses.stream().map(InterestResponse::getDisplayName).allMatch(Objects::nonNull));
    }

}