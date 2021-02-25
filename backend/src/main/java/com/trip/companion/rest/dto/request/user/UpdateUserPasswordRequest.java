package com.trip.companion.rest.dto.request.user;

import com.trip.companion.validation.Password;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
public class UpdateUserPasswordRequest {

    @Password
    private String password;

}
