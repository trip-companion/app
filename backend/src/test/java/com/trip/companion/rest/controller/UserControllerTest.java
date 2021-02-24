package com.trip.companion.rest.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trip.companion.EmbeddedMongoDbTest;
import com.trip.companion.TestUtils;
import com.trip.companion.config.jackson.ImageSrcFieldSerializer;
import com.trip.companion.domain.Feature;
import com.trip.companion.domain.Gender;
import com.trip.companion.domain.Interest;
import com.trip.companion.domain.Language;
import com.trip.companion.domain.Skill;
import com.trip.companion.domain.user.LanguageLevel;
import com.trip.companion.domain.user.Status;
import com.trip.companion.domain.user.User;
import com.trip.companion.error.dto.ErrorResponse;
import com.trip.companion.repository.UserRepository;
import com.trip.companion.rest.dto.request.EditUserRequest;
import com.trip.companion.rest.dto.request.LanguageLevelItemRequest;
import com.trip.companion.rest.dto.request.RegisterUserRequest;
import com.trip.companion.rest.dto.response.UserResponse;
import com.trip.companion.security.JwtService;
import com.trip.companion.service.FeatureService;
import com.trip.companion.service.InterestService;
import com.trip.companion.service.SkillService;
import com.trip.companion.service.UserService;
import com.trip.companion.service.file.FileItemService;
import java.time.LocalDate;
import java.util.Collections;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.apache.logging.log4j.util.Strings;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

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
    @Autowired
    private SkillService skillService;
    @Autowired
    private InterestService interestService;
    @Autowired
    private FeatureService featureService;

    @Test
    void verifyUserReturnedWithAuthHeader() throws Exception {
        userRepository.findByEmail(TEST_USER_EMAIL).ifPresent(user -> {
            user.setAvatarId(null);
            userRepository.save(user);
        });

        MockHttpServletResponse response = mockMvc.perform(get("/api/users/current")
                .header(HttpHeaders.AUTHORIZATION, testUtils.getJwtAccessToken())
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        UserResponse userResponse = objectMapper.readValue(response.getContentAsString(), UserResponse.class);

        assertEquals(TEST_USER_EMAIL, userResponse.getEmail());
        assertTrue(response.getContentAsString().contains("avatarSrc"));
        assertEquals(Strings.EMPTY, userResponse.getAvatarId());
    }

    @Test
    void verifyUnauthorizedStatusWithoutToken() throws Exception {
        String expectedMessage = "Full authentication is required to access this resource";

        MockHttpServletResponse response = mockMvc.perform(get("/api/users/current")
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

        MockHttpServletResponse response = mockMvc.perform(get("/api/users/current")
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

        RegisterUserRequest request = new RegisterUserRequest();
        request.setEmail(newUserEmail);
        request.setFirstName(newUserFirstName);
        request.setLastName(newUserLastName);
        request.setPassword(password);

        MockHttpServletResponse response = mockMvc.perform(post("/api/public/users")
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

        RegisterUserRequest request = new RegisterUserRequest();
        request.setEmail(TEST_USER_EMAIL);
        request.setFirstName("test");
        request.setLastName("test");
        request.setPassword(TEST_USER_PASSWORD);

        MockHttpServletResponse response = mockMvc.perform(post("/api/public/users")
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

        RegisterUserRequest request = new RegisterUserRequest();
        request.setEmail(TEST_USER_EMAIL);
        request.setFirstName("test");
        request.setLastName("test");
        request.setPassword(TEST_USER_PASSWORD);

        MockHttpServletResponse response = mockMvc.perform(post("/api/public/users")
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
        MockHttpServletResponse response = mockMvc.perform(multipart("/api/users/current/avatar")
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
        MockHttpServletResponse response = mockMvc.perform(multipart("/api/users/current/avatar")
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
        MockHttpServletResponse response = mockMvc.perform(multipart("/api/users/current/avatar")
                .file(file)
                .header(HttpHeaders.AUTHORIZATION, testUtils.getJwtAccessToken())
        ).andReturn().getResponse();

        ErrorResponse errorResponse = objectMapper.readValue(response.getContentAsString(), ErrorResponse.class);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatus());
        assertEquals(expectedErrorMessage, errorResponse.getMessage());
    }

    @Test
    void verifyValidationFailedOnEmptyFirstName() throws Exception {
        String expectedErrorMessage = "firstName: must not be empty";
        EditUserRequest request = new EditUserRequest();
        request.setLastName("lastName");

        MockHttpServletResponse response = mockMvc.perform(put("/api/users/current")
                .header(HttpHeaders.AUTHORIZATION, testUtils.getJwtAccessToken(TEST_USER_EMAIL))
                .content(objectMapper.writeValueAsBytes(request))
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        ErrorResponse errorResponse = objectMapper.readValue(response.getContentAsString(), ErrorResponse.class);

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY.value(), response.getStatus());
        assertEquals(expectedErrorMessage, errorResponse.getMessage());
    }

    @Test
    void verifyValidationFailedOnEmptyLastName() throws Exception {
        String expectedErrorMessage = "lastName: must not be empty";
        EditUserRequest request = new EditUserRequest();
        request.setFirstName("firstName");

        MockHttpServletResponse response = mockMvc.perform(put("/api/users/current")
                .header(HttpHeaders.AUTHORIZATION, testUtils.getJwtAccessToken(TEST_USER_EMAIL))
                .content(objectMapper.writeValueAsBytes(request))
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        ErrorResponse errorResponse = objectMapper.readValue(response.getContentAsString(), ErrorResponse.class);

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY.value(), response.getStatus());
        assertEquals(expectedErrorMessage, errorResponse.getMessage());
    }

    @Test
    void verifyValidationFailedOnTooLongDescription() throws Exception {
        String expectedErrorMessage = "about: length must be between 0 and 2048";
        EditUserRequest request = new EditUserRequest();
        request.setFirstName("firstName");
        request.setLastName("lastName");
        request.setAbout(IntStream.rangeClosed(0, 3000).mapToObj(String::valueOf).collect(Collectors.joining("")));

        MockHttpServletResponse response = mockMvc.perform(put("/api/users/current")
                .header(HttpHeaders.AUTHORIZATION, testUtils.getJwtAccessToken(TEST_USER_EMAIL))
                .content(objectMapper.writeValueAsBytes(request))
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        ErrorResponse errorResponse = objectMapper.readValue(response.getContentAsString(), ErrorResponse.class);

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY.value(), response.getStatus());
        assertEquals(expectedErrorMessage, errorResponse.getMessage());
    }

    @Test
    void verifyValidationFailedOnWrongBirthDate() throws Exception {
        String expectedErrorMessage = "birthDate: must be a past date";
        EditUserRequest request = new EditUserRequest();
        request.setFirstName("firstName");
        request.setLastName("lastName");
        request.setBirthDate(LocalDate.now().plusDays(1));

        MockHttpServletResponse response = mockMvc.perform(put("/api/users/current")
                .header(HttpHeaders.AUTHORIZATION, testUtils.getJwtAccessToken(TEST_USER_EMAIL))
                .content(objectMapper.writeValueAsBytes(request))
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        ErrorResponse errorResponse = objectMapper.readValue(response.getContentAsString(), ErrorResponse.class);

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY.value(), response.getStatus());
        assertEquals(expectedErrorMessage, errorResponse.getMessage());
    }

    @Test
    void assertUserEdited() throws Exception {
        String firstName = "firstName";
        String lastName = "lastName";
        String about = "about";
        LocalDate birthDate = LocalDate.now().minusDays(30);

        LanguageLevelItemRequest levelItem = new LanguageLevelItemRequest();
        levelItem.setIsoCode("ru");
        levelItem.setLevel(LanguageLevel.INTERMEDIATE);

        Skill skill = skillService.findAll().stream().findAny().orElseThrow();
        Interest interest = interestService.findAll().stream().findAny().orElseThrow();
        Feature feature = featureService.findAll().stream().findAny().orElseThrow();

        EditUserRequest request = new EditUserRequest();
        request.setFirstName(firstName);
        request.setLastName(lastName);
        request.setBirthDate(birthDate);
        request.setGender(Gender.FEMALE);
        request.setStatus(Status.AT_HOME);
        request.setAbout(about);
        request.setLanguages(Collections.singletonList(levelItem));
        request.setKnownSkills(Collections.singletonList(skill.getId()));
        request.setInterestedInSkills(Collections.singletonList(skill.getId()));
        request.setCanTeachSkills(Collections.singletonList(skill.getId()));
        request.setInterests(Collections.singletonList(interest.getId()));
        request.setFeatures(Collections.singletonList(feature.getId()));

        MockHttpServletResponse response = mockMvc.perform(put("/api/users/current")
                .header(HttpHeaders.AUTHORIZATION, testUtils.getJwtAccessToken(TEST_USER_EMAIL))
                .content(objectMapper.writeValueAsBytes(request))
                .contentType(MediaType.APPLICATION_JSON)
        ).andReturn().getResponse();

        User updatedUser = userService.getByEmail(TEST_USER_EMAIL);

        assertEquals(HttpStatus.OK.value(), response.getStatus());
        assertEquals(firstName, updatedUser.getFirstName());
        assertEquals(lastName, updatedUser.getLastName());
        assertEquals(about, updatedUser.getAbout());
        assertEquals(birthDate, updatedUser.getBirthDate());
        assertEquals(Gender.FEMALE, updatedUser.getGender());
        assertEquals(Status.AT_HOME, updatedUser.getStatus());
        assertEquals(1, updatedUser.getLanguages().size());
        assertEquals(levelItem.getIsoCode(), updatedUser.getLanguages().get(0).getIsoCode());
        assertEquals(levelItem.getLevel(), updatedUser.getLanguages().get(0).getLevel());
        assertEquals(Collections.singletonList(skill.getId()), updatedUser.getKnownSkills());
        assertEquals(Collections.singletonList(skill.getId()), updatedUser.getInterestedInSkills());
        assertEquals(Collections.singletonList(skill.getId()), updatedUser.getCanTeachSkills());
        assertEquals(Collections.singletonList(interest.getId()), updatedUser.getInterests());
        assertEquals(Collections.singletonList(feature.getId()), updatedUser.getFeatures());
    }

}