package com.trip.companion.rest.controller;

import com.trip.companion.EmbeddedMongoDbTest;
import com.trip.companion.domain.Language;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;

import static java.nio.file.Files.readString;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.util.ResourceUtils.getFile;

@SpringBootTest
@AutoConfigureMockMvc
@EmbeddedMongoDbTest
class PageItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void assertEngResponseReturned() throws Exception {
        String expectedResponse = readString(getFile("classpath:translation/user_account/eng.json").toPath());
        MockHttpServletResponse response = mockMvc.perform(get("/api/public/pages/user_account/" + Language.ENG))
                .andReturn().getResponse();

        assertEquals(expectedResponse, response.getContentAsString());
    }

    @Test
    void assertUkrResponseReturned() throws Exception {
        String expectedResponse = readString(getFile("classpath:translation/welcome/ukr.json").toPath());
        MockHttpServletResponse response = mockMvc.perform(get("/api/public/pages/welcome/" + Language.UKR))
                .andReturn().getResponse();

        assertEquals(expectedResponse, response.getContentAsString());
    }

    @Test
    void assert404ReturnedOnWrongRequest() throws Exception {
        MockHttpServletResponse response = mockMvc.perform(get("/api/public/pages/unknown_page/" + Language.UKR))
                .andReturn().getResponse();

        assertEquals(HttpStatus.NOT_FOUND.value(), response.getStatus());
    }
}