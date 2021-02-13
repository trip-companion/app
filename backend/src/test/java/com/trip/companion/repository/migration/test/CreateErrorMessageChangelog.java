package com.trip.companion.repository.migration.test;

import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import com.mongodb.client.MongoDatabase;
import com.trip.companion.domain.Language;
import com.trip.companion.error.ErrorCode;
import java.util.ArrayList;
import java.util.List;
import org.bson.Document;

import static com.trip.companion.domain.Language.ENG;
import static com.trip.companion.domain.Language.RUS;
import static com.trip.companion.domain.Language.UKR;

@ChangeLog(order = "003")
public class CreateErrorMessageChangelog {

    private static final List<Document> DOCUMENTS = new ArrayList<>();

    @ChangeSet(order = "001", id = "createErrorMessages", author = "skosinskyi")
    public void initWelcomePageItems(MongoDatabase db) {
        DOCUMENTS.add(createErrorMessageDoc(ENG, ErrorCode.USER_ALREADY_REGISTERED, "User with such email already registered"));
        DOCUMENTS.add(createErrorMessageDoc(UKR, ErrorCode.USER_ALREADY_REGISTERED, "Користувач з такою електронною адресою вже зареєстрований"));
        DOCUMENTS.add(createErrorMessageDoc(RUS, ErrorCode.USER_ALREADY_REGISTERED, "Пользователь с таким электронным адресом уже зарегистрирован"));

        DOCUMENTS.add(createErrorMessageDoc(ENG, ErrorCode.INTERNAL_SERVER_ERROR, "Something goes wrong. Please, try again later"));
        DOCUMENTS.add(createErrorMessageDoc(UKR, ErrorCode.INTERNAL_SERVER_ERROR, "Щось пішло не так. Будь ласка, спробуйте пізніше"));
        DOCUMENTS.add(createErrorMessageDoc(RUS, ErrorCode.INTERNAL_SERVER_ERROR, "Что-то пошло не так. Пожалуйста, повторите позже"));

        DOCUMENTS.add(createErrorMessageDoc(ENG, ErrorCode.AUTHENTICATION_ERROR, "Authorization error"));
        DOCUMENTS.add(createErrorMessageDoc(UKR, ErrorCode.AUTHENTICATION_ERROR, "Помилка аутентифікації"));
        DOCUMENTS.add(createErrorMessageDoc(RUS, ErrorCode.AUTHENTICATION_ERROR, "Ошибка аутентификации"));

        db.getCollection("errorMessage").insertMany(DOCUMENTS);
    }

    private Document createErrorMessageDoc(Language language, ErrorCode errorCode, String message) {
        return new Document()
                .append("language", language.name())
                .append("errorCode", errorCode.name())
                .append("message", message);
    }
}
