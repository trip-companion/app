package com.trip.companion.repository.migration.test;

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

@ChangeLog(order = "003")
public class CreateInterestsChangelog {

    private static final List<Document> INTERESTS = new ArrayList<>();

    @ChangeSet(order = "001", id = "createInterests", author = "skosinskyi")
    public void initInterests(MongoDatabase db) {
        INTERESTS.add(getInterest(getLanguageItem(ENG, "Camping"),
                getLanguageItem(UKR, "Кемпінг"),
                getLanguageItem(RUS, "Поход")));
        INTERESTS.add(getInterest(getLanguageItem(ENG, "Climbing"),
                getLanguageItem(UKR, "Альпінізм"),
                getLanguageItem(RUS, "Альпинизм")));
        INTERESTS.add(getInterest(getLanguageItem(ENG, "Sightseeing"),
                getLanguageItem(UKR, "Огляд визначних місць"),
                getLanguageItem(RUS, "Осмотр достопримечательностей")));

        db.getCollection("interest").insertMany(INTERESTS);
    }

    private Document getInterest(Document... languageItems) {
        return new Document().append("items", List.of(languageItems));
    }

    private Document getLanguageItem(Language language, String name) {
        return new Document().append("language", language.name()).append("name", name);
    }

}
