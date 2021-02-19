package com.trip.companion.rest.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trip.companion.EmbeddedMongoDbTest;
import com.trip.companion.TestUtils;
import com.trip.companion.config.jackson.ImageSrcFieldSerializer;
import com.trip.companion.domain.Language;
import com.trip.companion.domain.user.User;
import com.trip.companion.error.dto.ErrorResponse;
import com.trip.companion.repository.UserRepository;
import com.trip.companion.rest.controller.dto.request.UserRequest;
import com.trip.companion.rest.controller.dto.response.UserResponse;
import com.trip.companion.security.JwtService;
import com.trip.companion.service.UserService;
import com.trip.companion.service.file.FileItemService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static com.trip.companion.repository.migration.test.CreateUserChangelog.TEST_USER_EMAIL;
import static com.trip.companion.repository.migration.test.CreateUserChangelog.TEST_USER_PASSWORD;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

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
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;
    @SpyBean
    private FileItemService fileItemService;

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
        assertNotNull(errorResponse.getMessage());
    }

    @Test
    void assertNewUserRegistered() throws Exception {
        String newUserEmail = "newUser@gmail.com";
        String newUserFirstName = "firstName";
        String newUserLastName = "lastName";
        String password = "00000000";

        UserRequest request = new UserRequest();
        request.setEmail(newUserEmail);
        request.setFirstName(newUserFirstName);
        request.setLastName(newUserLastName);
        request.setPassword(password);

        MockHttpServletResponse response = mockMvc.perform(post("/api/public/user")
                .content(objectMapper.writeValueAsBytes(request))
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        User createdUser = userService.getByEmail(newUserEmail);

        assertEquals(HttpStatus.CREATED.value(), response.getStatus());
        assertEquals(newUserEmail, createdUser.getEmail());
        assertEquals(newUserFirstName, createdUser.getFirstName());
        assertEquals(newUserLastName, createdUser.getLastName());
        assertTrue(passwordEncoder.matches(password, createdUser.getPassword()));
    }

    @Test
    void assertBadRequestStatusIfUserAlreadyRegistered() throws Exception {
        String expectedErrorMessage = "User with email testUser@gmail.com already registered";
        String expectedDisplayErrorMessage = "User with such email already registered";

        UserRequest request = new UserRequest();
        request.setEmail(TEST_USER_EMAIL);
        request.setFirstName("test");
        request.setLastName("test");
        request.setPassword(TEST_USER_PASSWORD);

        MockHttpServletResponse response = mockMvc.perform(post("/api/public/user")
                .content(objectMapper.writeValueAsBytes(request))
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        ErrorResponse errorResponse = objectMapper.readValue(response.getContentAsString(), ErrorResponse.class);

        assertEquals(HttpStatus.BAD_REQUEST.value(), response.getStatus());
        assertEquals(expectedErrorMessage, errorResponse.getMessage());
        assertEquals(expectedDisplayErrorMessage, errorResponse.getDisplayMessage());
    }

    @Test
    void assertBadRequestAndStatusUkrDisplayMessageIfUserAlreadyRegistered() throws Exception {
        String expectedErrorMessage = "User with email testUser@gmail.com already registered";
        String expectedDisplayErrorMessage = "Користувач з такою електронною адресою вже зареєстрований";

        UserRequest request = new UserRequest();
        request.setEmail(TEST_USER_EMAIL);
        request.setFirstName("test");
        request.setLastName("test");
        request.setPassword(TEST_USER_PASSWORD);

        MockHttpServletResponse response = mockMvc.perform(post("/api/public/user")
                .header("Language", Language.UKR)
                .content(objectMapper.writeValueAsBytes(request))
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        ErrorResponse errorResponse = objectMapper.readValue(response.getContentAsString(), ErrorResponse.class);

        assertEquals(HttpStatus.BAD_REQUEST.value(), response.getStatus());
        assertEquals(expectedErrorMessage, errorResponse.getMessage());
        assertEquals(expectedDisplayErrorMessage, errorResponse.getDisplayMessage());
    }

    @Test
    void assertAvatarCreated() throws Exception {
        User user = userService.getByEmail(TEST_USER_EMAIL);
        user.setAvatarId(null);
        userRepository.save(user);

        MockMultipartFile file = new MockMultipartFile("file", "test.jpeg",
                MediaType.IMAGE_JPEG_VALUE, new byte[] {0, 0, 0, 0});
        MockHttpServletResponse response = mockMvc.perform(multipart("/api/user/avatar")
                .file(file)
                .header(HttpHeaders.AUTHORIZATION, testUtils.getJwtAccessToken())
        ).andReturn().getResponse();

        UserResponse userResponse = objectMapper.readValue(response.getContentAsString(), UserResponse.class);

        String createdAvatarId = userService.getByEmail(TEST_USER_EMAIL).getAvatarId();
        String expectedAvatarSrc = ImageSrcFieldSerializer.FILES_ENDPOINT + createdAvatarId;

        assertNotNull(createdAvatarId);
        assertTrue(response.getContentAsString().contains("avatarSrc"));
        assertEquals(expectedAvatarSrc, userResponse.getAvatarId());
    }

    @Test
    void assertAvatarChanged() throws Exception {
        String oldAvatarId = "oldAvatarId";
        User user = userService.getByEmail(TEST_USER_EMAIL);
        user.setAvatarId(oldAvatarId);
        userRepository.save(user);

        MockMultipartFile file = new MockMultipartFile("file", "test.jpeg",
                MediaType.IMAGE_JPEG_VALUE, new byte[] {0, 0, 0, 0});
        MockHttpServletResponse response = mockMvc.perform(multipart("/api/user/avatar")
                .file(file)
                .header(HttpHeaders.AUTHORIZATION, testUtils.getJwtAccessToken())
        ).andReturn().getResponse();

        UserResponse userResponse = objectMapper.readValue(response.getContentAsString(), UserResponse.class);

        String createdAvatarId = userService.getByEmail(TEST_USER_EMAIL).getAvatarId();
        String expectedAvatarSrc = ImageSrcFieldSerializer.FILES_ENDPOINT + createdAvatarId;

        assertNotNull(createdAvatarId);
        assertNotEquals(oldAvatarId, createdAvatarId);
        assertTrue(response.getContentAsString().contains("avatarSrc"));
        assertEquals(expectedAvatarSrc, userResponse.getAvatarId());
        verify(fileItemService, times(1)).removeFileItemAsync(oldAvatarId);
    }

    @Test
    void assertErrorOnWrongAvatarType() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.txt",
                MediaType.TEXT_PLAIN_VALUE, new byte[] {0, 0, 0, 0});
        String expectedErrorMessage = "File test.txt is not an image file, content-type: text/plain";
        MockHttpServletResponse response = mockMvc.perform(multipart("/api/user/avatar")
                .file(file)
                .header(HttpHeaders.AUTHORIZATION, testUtils.getJwtAccessToken())
        ).andReturn().getResponse();

        ErrorResponse errorResponse = objectMapper.readValue(response.getContentAsString(), ErrorResponse.class);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatus());
        assertEquals(expectedErrorMessage, errorResponse.getMessage());
    }

}