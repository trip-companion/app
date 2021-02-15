package com.trip.companion.repository.error;

import com.trip.companion.domain.error.ErrorMessage;
import com.trip.companion.error.ErrorCode;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ErrorMessageRepository extends MongoRepository<ErrorMessage, String> {

    List<ErrorMessage> findAllByErrorCode(ErrorCode errorCode);

}
