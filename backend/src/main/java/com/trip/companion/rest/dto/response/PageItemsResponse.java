package com.trip.companion.rest.dto.response;

import com.fasterxml.jackson.annotation.JsonRawValue;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PageItemsResponse {

    @JsonRawValue
    private String mappings;

}
