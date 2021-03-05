package com.trip.companion.rest.controller;

import com.trip.companion.EmbeddedMongoDbTest;
import com.trip.companion.domain.Language;
import com.trip.companion.domain.page.Page;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
@EmbeddedMongoDbTest
class PageItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void assertEngResponseReturned() throws Exception {
        String expectedResponse = "{\"mappings\":{\"header\":{\"buttons\":{\"buttonChat\":{\"text\":\"Chat\"},\"buttonMyPosts\":{\"text\":\"My posts\"},\"buttonFeedback\":{\"text\":\"Feedback\"}}},\"personalInfo\":{\"email\":{\"emailInput\":{\"text\":\"Email\"},\"button\":{\"text\":\"Change email\"}},\"password\":{\"passwordInput\":{\"text\":\"Password\"},\"repeatPasswordInput\":{\"text\":\"Repeat password\"},\"button\":{\"text\":\"Change password\"}},\"detailsInfo\":{\"nameInput\":{\"text\":\"First name\"},\"lastNameInput\":{\"text\":\"Last name\"},\"status\":{\"text\":\"Pick your status\",\"AT_HOME\":{\"text\":\"At home\"},\"LOOKING_FOR_TRAVEL\":{\"text\":\"Looking for travel\"},\"TRAVELLING\":{\"text\":\"Travelling\"}},\"yearsOld\":{\"text\":\"years  old\"},\"gender\":{\"text\":\"Gender\",\"MALE\":{\"text\":\"Male\"},\"FEMALE\":{\"text\":\"Female\"}},\"description\":{\"text\":\"Description\",\"placeholder\":{\"text\":\"About you\"}},\"languages\":{\"text\":\"Languages\",\"input\":{\"text\":\"Languages\"},\"BEGINNER\":{\"text\":\"Beginner\"},\"INTERMEDIATE\":{\"text\":\"Intermediate\"},\"ADVANCED\":{\"text\":\"Advanced\"},\"NATIVE\":{\"text\":\"Native\"}},\"interests\":{\"text\":\"My interests\",\"placeholder\":{\"text\":\"New interest...\"}},\"skills\":{\"text\":\"My skills\",\"input\":{\"text\":\"Choose skills\"},\"description\":{\"text\":\"More details about your skills\",\"placeholder\":{\"text\":\"More information\"}},\"canTeach\":{\"text\":\"Can teach\"},\"known\":{\"text\":\"Some knowledge\"},\"interestedIn\":{\"text\":\"Interested in\"}},\"more\":{\"text\":\"Some additional information\"},\"submitBtn\":{\"text\":\"Submit\"}},\"securityTitle\":{\"text\":\"Security data\"},\"detailsTitle\":{\"text\":\"Personal data\"}}}}";
        MockHttpServletResponse response = mockMvc.perform(get("/api/public/pages/" + Page.USER_ACCOUNT + "/" + Language.ENG))
                .andReturn().getResponse();

        assertEquals(expectedResponse, response.getContentAsString());
    }

    @Test
    void assertUkrResponseReturned() throws Exception {
        String expectedResponse = "{\"mappings\":{\"main\":{\"searchArea\":{\"destination\":{\"text\":\"Пункт призначення\",\"placeholder\":{\"text\":\"Виберіть пункт призначення\"}},\"dateRange\":{\"text\":\"Дати\",\"placeholder\":{\"text\":\"Виберіть дати відправлення та прибуття\"}},\"peopleCount\":{\"text\":\"Кількість людей\"},\"submitButton\":{\"text\":\"Пошук\"}}}}}";
        MockHttpServletResponse response = mockMvc.perform(get("/api/public/pages/" + Page.WELCOME + "/" + Language.UKR))
                .andReturn().getResponse();

        assertEquals(expectedResponse, response.getContentAsString());
    }

    @Test
    void assertAllPagesHaveItemsForAllLanguages() throws Exception {
        String emptyMappings = "{\"mappings\":{}}";
        for (Page page : Page.values()) {
            for (Language language : Language.values()) {
                MockHttpServletResponse response = mockMvc.perform(get("/api/public/pages/" + page + "/" + language))
                        .andReturn().getResponse();

                assertNotEquals(emptyMappings, response.getContentAsString());
            }
        }
    }
}