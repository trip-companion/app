package com.trip.companion.service;

import com.trip.companion.domain.user.User;
import com.trip.companion.error.exception.ActionForbiddenException;
import com.trip.companion.error.exception.NoDataFoundException;
import com.trip.companion.repository.UserRepository;
import com.trip.companion.security.JwtService;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository repository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository repository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
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
            throw new ActionForbiddenException("User with email " + email + "already registered");
        }
        User user = new User();
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPassword(passwordEncoder.encode(password));
        return repository.save(user);
    }
}

