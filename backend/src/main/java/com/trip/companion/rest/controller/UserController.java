package com.trip.companion.rest.controller;

import com.trip.companion.rest.controller.dto.request.UserRequest;
import com.trip.companion.rest.controller.dto.response.UserResponse;
import com.trip.companion.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("api")
public class UserController extends MappingController {

    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("public/user")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void registerUser(@Valid @RequestBody UserRequest request) {
        userService.registerUser(request.getEmail(), request.getFirstName(), request.getLastName(),
                request.getPassword());
    }

    @GetMapping("user/current")
    public UserResponse getCurrentUser() {
        return mapEntityToResponseDto(userService.getCurrentUser(), UserResponse.class);
    }

}
