package com.trip.companion.rest.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trip.companion.EmbeddedMongoDbTest;
import com.trip.companion.repository.SkillRepository;
import com.trip.companion.rest.dto.response.SkillResponse;
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
class SkillControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private SkillRepository skillRepository;

    @Test
    void assertSkillsReturned() throws Exception {
        MockHttpServletResponse response =
                mockMvc.perform(MockMvcRequestBuilders.get("/api/public/skills"))
                        .andReturn().getResponse();

        List<SkillResponse> skillResponses = objectMapper.readValue(response.getContentAsString(),
                new TypeReference<>() {
                });

        assertFalse(skillResponses.isEmpty());
        assertEquals(skillRepository.findAll().size(), skillResponses.size());
        assertTrue(skillResponses.stream().map(SkillResponse::getId).allMatch(Objects::nonNull));
        assertTrue(skillResponses.stream().map(SkillResponse::getDisplayName).allMatch(Objects::nonNull));
    }

}