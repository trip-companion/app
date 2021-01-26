package com.trip.companion.service;

import com.trip.companion.domain.user.User;
import com.trip.companion.error.exception.ActionForbiddenException;
import com.trip.companion.error.exception.AuthenticationException;
import com.trip.companion.error.exception.NoDataFoundException;
import com.trip.companion.repository.UserRepository;
import com.trip.companion.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository repository;
    private final JwtService jwtService;

    @Autowired
    public UserService(UserRepository repository, JwtService jwtService) {
        this.repository = repository;
        this.jwtService = jwtService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
        try {
            return findByEmail(email);
        } catch (Exception exc) {
            throw new AuthenticationException("Bad credentials");
        }
    }

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return findByEmail(email);
    }

    public User setRefreshToken(User user) {
        if (user.getId() == null) {
            throw new ActionForbiddenException("User id must not be null when set refresh token");
        }
        user.setJwtRefreshToken(UUID.randomUUID().toString());
        user.setJwtRefreshTokenExpireDate(jwtService.getJwtRefreshTokenExpire());
        return repository.save(user);
    }

    public User findByRefreshToken(String jwtRefreshToken) {
        return repository.findByJwtRefreshToken(jwtRefreshToken)
                .orElseThrow(() -> new NoDataFoundException("User not found by refresh token " + jwtRefreshToken));
    }

    public User findByEmail(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() -> new NoDataFoundException("User not found by email " + email));
    }
}

