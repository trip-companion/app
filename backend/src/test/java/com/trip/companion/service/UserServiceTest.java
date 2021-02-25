package com.trip.companion.service;

import com.trip.companion.domain.user.User;
import com.trip.companion.repository.UserRepository;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import javax.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
class UserServiceTest {

    @Autowired
    private UserService userService;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private SkillService skillService;
    @MockBean
    private InterestService interestService;
    @MockBean
    private FeatureService featureService;

    @BeforeEach
    public void init() {
        Authentication authentication = mock(Authentication.class);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        when(authentication.getName()).thenReturn("name");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(new User()));
    }

    @Test
    void verifyValidationExceptionThrownOnWrongSkillIdList() {
        List<String> skillIdList = List.of("wrongSkill");

        User user = new User();
        user.setKnownSkills(skillIdList);

        when(skillService.existsAllByIdIn(skillIdList)).thenReturn(false);

        assertThrows(ValidationException.class, () -> userService.editUser(user));
    }

    @Test
    void verifyValidationExceptionNotThrownOnEmptySkillIdList() {
        User user = new User();
        user.setKnownSkills(Collections.emptyList());

        assertDoesNotThrow(() -> userService.editUser(user));
    }

    @Test
    void verifyValidationExceptionThrownOnWrongInterestIdList() {
        List<String> idList = List.of("wrongInterest");

        User user = new User();
        user.setInterests(idList);

        when(interestService.existsAllByIdIn(idList)).thenReturn(false);

        assertThrows(ValidationException.class, () -> userService.editUser(user));
    }

    @Test
    void verifyValidationExceptionNotThrownOnEmptyInterestIdList() {
        User user = new User();
        user.setInterests(Collections.emptyList());

        assertDoesNotThrow(() -> userService.editUser(user));
    }

    @Test
    void verifyValidationExceptionThrownOnWrongFeatureIdList() {
        List<String> idList = List.of("wrongFeature");

        User user = new User();
        user.setFeatures(idList);

        when(featureService.existsAllByIdIn(idList)).thenReturn(false);

        assertThrows(ValidationException.class, () -> userService.editUser(user));
    }

    @Test
    void verifyValidationExceptionNotThrownOnEmptyFeatureIdList() {
        User user = new User();
        user.setFeatures(Collections.emptyList());

        assertDoesNotThrow(() -> userService.editUser(user));
    }

}