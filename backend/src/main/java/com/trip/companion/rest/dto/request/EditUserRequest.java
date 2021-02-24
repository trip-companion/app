package com.trip.companion.rest.dto.request;

import com.trip.companion.domain.Gender;
import com.trip.companion.domain.user.Status;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Past;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class EditUserRequest {

    @NotEmpty
    private String firstName;
    @NotEmpty
    private String lastName;
    @Past
    private LocalDate birthDate;
    private Gender gender;
    private Status status;
    @Length(max = 2048)
    private String about;
    @Valid
    private List<LanguageLevelItemRequest> languages = new ArrayList<>();
    private List<String> knownSkills = new ArrayList<>();
    private List<String> interestedInSkills = new ArrayList<>();
    private List<String> canTeachSkills = new ArrayList<>();
    private List<String> interests = new ArrayList<>();
    private List<String> features = new ArrayList<>();

}
