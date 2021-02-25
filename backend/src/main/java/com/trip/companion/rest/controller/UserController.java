package com.trip.companion.rest.controller;

import com.trip.companion.domain.user.User;
import com.trip.companion.rest.dto.request.user.RegisterUserRequest;
import com.trip.companion.rest.dto.request.user.UpdateUserPasswordRequest;
import com.trip.companion.rest.dto.request.user.UpdateUserRequest;
import com.trip.companion.rest.dto.response.UserResponse;
import com.trip.companion.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api")
public class UserController extends MappingController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("public/users")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerUser(@RequestBody RegisterUserRequest request) {
        userService.registerUser(request.getEmail(), request.getFirstName(), request.getLastName(),
                request.getPassword());
    }

    @GetMapping("users/current")
    public UserResponse getCurrentUser() {
        return mapEntityToResponseDto(userService.getCurrentUser(), UserResponse.class);
    }

    @PutMapping("users/current")
    public UserResponse updateUser(@RequestBody UpdateUserRequest request) {
        return mapEntityToResponseDto(userService.editUser(modelMapper.map(request, User.class)), UserResponse.class);
    }

    @PutMapping("users/current/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateUserPassword(@RequestBody UpdateUserPasswordRequest request) {
        userService.updatePassword(request.getPassword());
    }

    @PostMapping("users/current/avatar")
    public UserResponse uploadAvatar(@RequestParam MultipartFile file) {
        return mapEntityToResponseDto(userService.uploadAvatar(file), UserResponse.class);
    }

}
