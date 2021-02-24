package com.trip.companion.repository.migration;

import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import com.mongodb.client.MongoDatabase;
import com.trip.companion.domain.Language;
import java.util.ArrayList;
import java.util.List;
import org.bson.Document;

import static com.trip.companion.domain.Language.ENG;
import static com.trip.companion.domain.Language.RUS;
import static com.trip.companion.domain.Language.UKR;

@ChangeLog(order = "005")
public class CreateFeaturesChangelog {

    private static final List<Document> FEATURES = new ArrayList<>();

    @ChangeSet(order = "001", id = "createFeatures", author = "skosinskyi")
    public void createFeatures(MongoDatabase db) {
        FEATURES.add(getFeature(getLanguageItem(ENG, "Smoker"),
                getLanguageItem(UKR, "Курець"),
                getLanguageItem(RUS, "Курильщик")));
        FEATURES.add(getFeature(getLanguageItem(ENG, "Driver's licence"),
                getLanguageItem(UKR, "Водійські права"),
                getLanguageItem(RUS, "Водительское удостоверение")));
        FEATURES.add(getFeature(getLanguageItem(ENG, "Allergy"),
                getLanguageItem(UKR, "Алергія"),
                getLanguageItem(RUS, "Аллергия")));
        FEATURES.add(getFeature(getLanguageItem(ENG, "Special diet"),
                getLanguageItem(UKR, "Спеціальна дієта"),
                getLanguageItem(RUS, "Специальная диета")));
        FEATURES.add(getFeature(getLanguageItem(ENG, "Travel with pets"),
                getLanguageItem(UKR, "Подорожую з домашніми тваринами"),
                getLanguageItem(RUS, "Путешествую с домашними животными")));

        db.getCollection("feature").insertMany(FEATURES);
    }

    private Document getFeature(Document... languageItems) {
        return new Document().append("items", List.of(languageItems));
    }

    private Document getLanguageItem(Language language, String name) {
        return new Document().append("language", language.name()).append("name", name);
    }

}
