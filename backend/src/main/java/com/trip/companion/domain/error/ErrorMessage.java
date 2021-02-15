package com.trip.companion.domain.error;

import com.trip.companion.domain.Language;
import com.trip.companion.domain.base.BaseEntity;
import com.trip.companion.error.ErrorCode;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data
@EqualsAndHashCode(callSuper = true)
public class ErrorMessage extends BaseEntity {

    private ErrorCode errorCode;
    private Language language;
    private String message;

}
