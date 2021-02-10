package com.trip.companion.repository.migration;

import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import com.mongodb.client.MongoDatabase;
import com.trip.companion.domain.Language;
import com.trip.companion.domain.page.Page;
import java.util.ArrayList;
import java.util.List;
import org.bson.Document;

import static com.trip.companion.domain.Language.ENG;
import static com.trip.companion.domain.Language.RUS;
import static com.trip.companion.domain.Language.UKR;
import static com.trip.companion.domain.page.Page.WELCOME;

@ChangeLog(order = "002")
public class CreatePageItemsChangelog {
    private static final String DESTINATION_CODE = "main.searchArea.destination";
    private static final String DATE_RANGE_CODE = "main.searchArea.dateRange";
    private static final String PEOPLE_COUNT_CODE = "main.searchArea.peopleCount";
    private static final String SUBMIT_BUTTON_CODE = "main.searchArea.submitButton";

    private static final List<Document> DOCUMENTS = new ArrayList<>();

    @ChangeSet(order = "001", id = "createPageItems", author = "skosinskyi")
    public void initWelcomePageItems(MongoDatabase db) {
        DOCUMENTS.add(createPageItemDoc(ENG, WELCOME, DESTINATION_CODE, "Destination", "Choose a destination"));
        DOCUMENTS.add(createPageItemDoc(UKR, WELCOME, DESTINATION_CODE, "Пункт призначення", "Виберіть пункт призначення"));
        DOCUMENTS.add(createPageItemDoc(RUS, WELCOME, DESTINATION_CODE, "Пункт назначения", "Выберите направление"));

        DOCUMENTS.add(createPageItemDoc(ENG, WELCOME, DATE_RANGE_CODE, "Date range", "Choose departure and arrival dates"));
        DOCUMENTS.add(createPageItemDoc(UKR, WELCOME, DATE_RANGE_CODE, "Дати", "Виберіть дати відправлення та прибуття"));
        DOCUMENTS.add(createPageItemDoc(RUS, WELCOME, DATE_RANGE_CODE, "Даты", "Выберите даты отправления и прибытия"));

        DOCUMENTS.add(createPageItemDoc(ENG, WELCOME, PEOPLE_COUNT_CODE, "People count"));
        DOCUMENTS.add(createPageItemDoc(UKR, WELCOME, PEOPLE_COUNT_CODE, "Кількість людей"));
        DOCUMENTS.add(createPageItemDoc(RUS, WELCOME, PEOPLE_COUNT_CODE, "Количество людей"));

        DOCUMENTS.add(createPageItemDoc(ENG, WELCOME, SUBMIT_BUTTON_CODE, "Submit"));
        DOCUMENTS.add(createPageItemDoc(UKR, WELCOME, SUBMIT_BUTTON_CODE, "Пошук"));
        DOCUMENTS.add(createPageItemDoc(RUS, WELCOME, SUBMIT_BUTTON_CODE, "Искать"));

        db.getCollection("pageItem").insertMany(DOCUMENTS);
    }

    private Document createPageItemDoc(Language language, Page page, String itemCode, String text) {
        return createPageItemDoc(language, page, itemCode, text, null);
    }

    private Document createPageItemDoc(Language language, Page page, String item, String text, String placeholder) {
        Document content = new Document().append("text", text);
        if (placeholder != null) {
            content.append("placeholder", placeholder);
        }
        return new Document()
                .append("language", language.name())
                .append("page", page.name())
                .append("item", item)
                .append("content", content);
    }
}
