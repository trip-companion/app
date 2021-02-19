package com.trip.companion.rest.controller.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.trip.companion.config.jackson.ImageSrc;
import lombok.Data;

@Data
public class UserResponse {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    @JsonProperty(value = "avatarSrc")
    @ImageSrc
    private String avatarId;
}
