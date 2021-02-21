package com.trip.companion.rest.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trip.companion.EmbeddedMongoDbTest;
import com.trip.companion.domain.file.FileItem;
import com.trip.companion.error.dto.ErrorResponse;
import com.trip.companion.service.file.FileItemService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
@EmbeddedMongoDbTest
class FileItemControllerTest {

    @Autowired
    private FileItemService fileItemService;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void assertFileContentReturned() throws Exception {
        byte[] expectedContent = {0, 0, 0, 0};
        MockMultipartFile file = new MockMultipartFile("file", "test.txt",
                MediaType.TEXT_PLAIN_VALUE, expectedContent);

        FileItem fileItem = fileItemService.uploadFile(file);

        MockHttpServletResponse response = mockMvc.perform(get("/api/public/files/" + fileItem.getId()))
                .andReturn().getResponse();

        byte[] responseContent = response.getContentAsByteArray();

        assertArrayEquals(expectedContent, responseContent);
        assertNotNull(response.getContentType());
        assertTrue(response.getContentType().startsWith(MediaType.APPLICATION_OCTET_STREAM_VALUE));
    }

    @Test
    void assertErrorReturnedOnMissingFile() throws Exception {
        String wrongFileId = "wrongFileId";
        String expectedErrorMessage = "File item not found by id " + wrongFileId;
        MockHttpServletResponse response = mockMvc.perform(get("/api/public/files/" + wrongFileId))
                .andReturn().getResponse();

        ErrorResponse errorResponse = objectMapper.readValue(response.getContentAsString(), ErrorResponse.class);

        assertEquals(HttpStatus.NOT_FOUND.value(), response.getStatus());
        assertEquals(expectedErrorMessage, errorResponse.getMessage());
    }

}