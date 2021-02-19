package com.trip.companion.service;

import com.trip.companion.domain.file.FileItem;
import com.trip.companion.domain.user.User;
import com.trip.companion.error.exception.NoDataFoundException;
import com.trip.companion.error.exception.client.UserAlreadyRegisteredException;
import com.trip.companion.repository.UserRepository;
import com.trip.companion.security.JwtService;
import com.trip.companion.service.file.FileItemService;
import java.util.Optional;
import java.util.UUID;
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

    @Autowired
    public UserService(UserRepository repository, JwtService jwtService, PasswordEncoder passwordEncoder,
                       FileItemService fileItemService) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.fileItemService = fileItemService;
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

    public User registerUser(String email, String firstName, String lastName, String password) {
        if (repository.existsByEmail(email)) {
            throw new UserAlreadyRegisteredException(email);
        }
        User user = new User();
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPassword(passwordEncoder.encode(password));
        return repository.save(user);
    }

    public User uploadAvatar(MultipartFile file) {
        User currentUser = getCurrentUser();
        log.info("Updating avatar for user with id {}", currentUser.getId());
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
}

