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

@ChangeLog(order = "004")
public class CreateSkillsChangelog {

    private static final List<Document> SKILLS = new ArrayList<>();

    @ChangeSet(order = "001", id = "createSkills", author = "skosinskyi")
    public void initSkills(MongoDatabase db) {
        SKILLS.add(getSkill(getLanguageItem(ENG, "Driver"),
                getLanguageItem(UKR, "Водій"),
                getLanguageItem(RUS, "Водитель")));
        SKILLS.add(getSkill(getLanguageItem(ENG, "Pitch a tent"),
                getLanguageItem(UKR, "Ставити намет"),
                getLanguageItem(RUS, "Ставить палатку")));
        SKILLS.add(getSkill(getLanguageItem(ENG, "Map-reading"),
                getLanguageItem(UKR, "Орієнтування по картам"),
                getLanguageItem(RUS, "Ориентирование по картам")));

        db.getCollection("skill").insertMany(SKILLS);
    }

    private Document getSkill(Document... languageItems) {
        return new Document().append("items", List.of(languageItems));
    }

    private Document getLanguageItem(Language language, String name) {
        return new Document().append("language", language.name()).append("name", name);
    }

}
