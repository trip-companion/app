package com.trip.companion.rest.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.trip.companion.config.jackson.ImageSrc;
import com.trip.companion.domain.Gender;
import com.trip.companion.domain.user.LanguageLevel;
import com.trip.companion.domain.user.Status;
import java.time.LocalDate;
import java.util.List;
import lombok.Data;

@Data
public class UserResponse {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private Gender gender;
    private Status status;
    private String about;
    private LocalDate birthDate;
    @JsonProperty(value = "avatarSrc")
    @ImageSrc
    private String avatarId;
    private List<LanguageLevelItemResponse> languages;
    private List<String> knownSkills;
    private List<String> interestedInSkills;
    private List<String> canTeachSkills;
    private List<String> interests;
    private List<String> features;

    @Data
    public static class LanguageLevelItemResponse {

        private String isoCode;
        private LanguageLevel level;

    }
}
