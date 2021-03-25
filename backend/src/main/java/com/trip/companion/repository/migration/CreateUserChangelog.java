package com.trip.companion.repository.migration;

import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import com.mongodb.client.MongoDatabase;
import com.trip.companion.domain.Gender;
import com.trip.companion.domain.user.LanguageLevel;
import com.trip.companion.domain.user.Status;
import java.time.LocalDate;
import java.util.List;
import org.bson.Document;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static com.trip.companion.domain.user.LanguageLevel.BEGINNER;
import static com.trip.companion.domain.user.LanguageLevel.NATIVE;

@ChangeLog(order = "005")
public class CreateUserChangelog {

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @ChangeSet(order = "001", id = "createUser", author = "skosinskyi")
    public void initUser(MongoDatabase db) {
        Document user = new Document()
                .append("email", "testUser@gmail.com")
                .append("firstName", "Elon")
                .append("lastName", "Musk")
                .append("birthDate", LocalDate.of(1971, 6, 28))
                .append("gender", Gender.MALE.name())
                .append("status", Status.LOOKING_FOR_TRAVEL.name())
                .append("about", "CEO, CTO, and chief designer of SpaceX. CEO and product architect of Tesla, Inc. "
                        + "Founder of The Boring Company. Co-founder of Neuralink. Co-founder and initial co-chairman"
                        + " of OpenAI. A centibillionaire,  one of the richest people in the world")
                .append("languages", List.of(getLanguageLevel("en", NATIVE), getLanguageLevel("uk", BEGINNER)))
                .append("password", passwordEncoder.encode("12345678"));
        db.getCollection("user").insertOne(user);
    }

    private Document getLanguageLevel(String isoCode, LanguageLevel level) {
        return new Document().append("isoCode", isoCode).append("level", level.name());
    }

}