package com.trip.companion.rest.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trip.companion.rest.dto.response.LanguageResponse;
import java.util.List;
import java.util.Locale;
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
class LanguageControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void assertLanguagesReturned() throws Exception {
        MockHttpServletResponse response =
                mockMvc.perform(MockMvcRequestBuilders.get("/api/public/languages"))
                        .andReturn().getResponse();

        List<LanguageResponse> languageResponses = objectMapper.readValue(response.getContentAsString(),
                new TypeReference<>() {
                });

        assertFalse(languageResponses.isEmpty());
        assertEquals(Locale.getISOLanguages().length, languageResponses.size());
        assertTrue(languageResponses.stream().map(LanguageResponse::getIsoCode).allMatch(Objects::nonNull));
        assertTrue(languageResponses.stream().map(LanguageResponse::getDisplayName).allMatch(Objects::nonNull));
    }

}