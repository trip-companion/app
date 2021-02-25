package com.trip.companion.service;

import com.trip.companion.domain.file.FileItem;
import com.trip.companion.domain.user.User;
import com.trip.companion.error.exception.NoDataFoundException;
import com.trip.companion.error.exception.client.UserAlreadyRegisteredException;
import com.trip.companion.repository.UserRepository;
import com.trip.companion.security.JwtService;
import com.trip.companion.service.file.FileItemService;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.validation.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
public class UserService implements UserDetailsService {

    private final UserRepository repository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final FileItemService fileItemService;
    private final SkillService skillService;
    private final InterestService interestService;
    private final FeatureService featureService;

    @Autowired
    public UserService(UserRepository repository, JwtService jwtService, PasswordEncoder passwordEncoder,
                       FileItemService fileItemService, SkillService skillService, InterestService interestService,
                       FeatureService featureService) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.fileItemService = fileItemService;
        this.skillService = skillService;
        this.interestService = interestService;
        this.featureService = featureService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
        try {
            return getByEmail(email);
        } catch (Exception exc) {
            throw new BadCredentialsException("Bad credentials");
        }
    }

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return getByEmail(email);
    }

    public User setRefreshToken(User user) {
        user.setJwtRefreshToken(UUID.randomUUID().toString());
        user.setJwtRefreshTokenExpireDate(jwtService.getJwtRefreshTokenExpire());
        return repository.save(user);
    }

    public Optional<User> findByRefreshToken(String jwtRefreshToken) {
        return repository.findByJwtRefreshToken(jwtRefreshToken);
    }

    public Optional<User> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    public User getByEmail(String email) {
        return findByEmail(email)
                .orElseThrow(() -> new NoDataFoundException("User not found by email " + email));
    }

    public void registerUser(String email, String firstName, String lastName, String password) {
        if (repository.existsByEmail(email)) {
            throw new UserAlreadyRegisteredException(email);
        }
        User user = new User();
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPassword(passwordEncoder.encode(password));
        String userId = repository.save(user).getId();
        log.info("Created user {} with email {}", userId, email);
    }

    public User uploadAvatar(MultipartFile file) {
        User currentUser = getCurrentUser();
        log.info("Updating avatar for user {}", currentUser.getId());
        FileItem fileItem = fileItemService.uploadImage(file);
        User user = updateAvatar(fileItem, currentUser);
        log.info("Avatar id was updated to {} for user {}", user.getAvatarId(), user.getId());
        return user;
    }

    private User updateAvatar(FileItem fileItem, User user) {
        String oldAvatarId = user.getAvatarId();
        user.setAvatarId(fileItem.getId());
        User updatedUser = repository.save(user);
        Optional.ofNullable(oldAvatarId).ifPresent(avatarId -> {
            log.info("Removing old avatar file with id {} of user {}", avatarId, user.getId());
            fileItemService.removeFileItemAsync(avatarId);
        });
        return updatedUser;
    }

    public User editUser(User editedUser) {
        User user = getCurrentUser();
        user.setFirstName(editedUser.getFirstName());
        user.setLastName(editedUser.getLastName());
        user.setLanguages(editedUser.getLanguages());
        user.setBirthDate(editedUser.getBirthDate());
        user.setGender(editedUser.getGender());
        user.setStatus(editedUser.getStatus());
        user.setAbout(editedUser.getAbout());
        user.setKnownSkills(validateAndGetSkills(editedUser.getKnownSkills()));
        user.setInterestedInSkills(validateAndGetSkills(editedUser.getInterestedInSkills()));
        user.setCanTeachSkills(validateAndGetSkills(editedUser.getCanTeachSkills()));
        user.setInterests(validateAndGetInterests(editedUser.getInterests()));
        user.setFeatures(validateAndGetFeatures(editedUser.getFeatures()));
        log.info("Updated user with id {} data", user.getId());
        return repository.save(user);
    }

    private List<String> validateAndGetSkills(List<String> skillIdList) {
        if (skillIdList.isEmpty() || skillService.existsAllByIdIn(skillIdList)) {
            return skillIdList;
        } else {
            throw new ValidationException("Unknown skills");
        }
    }

    private List<String> validateAndGetInterests(List<String> interestIdList) {
        if (interestIdList.isEmpty() || interestService.existsAllByIdIn(interestIdList)) {
            return interestIdList;
        } else {
            throw new ValidationException("Unknown interests");
        }
    }

    private List<String> validateAndGetFeatures(List<String> featureIdList) {
        if (featureIdList.isEmpty() || featureService.existsAllByIdIn(featureIdList)) {
            return featureIdList;
        } else {
            throw new ValidationException("Unknown features");
        }
    }

    public void updatePassword(String password) {
        User user = getCurrentUser();
        user.setPassword(passwordEncoder.encode(password));
        repository.save(user);
        log.info("Password was changed for user {}", user.getId());
    }
}

