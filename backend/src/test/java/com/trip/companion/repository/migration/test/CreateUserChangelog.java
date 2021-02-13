package com.trip.companion.repository.migration.test;

import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@ChangeLog(order = "001")
public class CreateUserChangelog {
    public static final String TEST_USER_EMAIL = "testUser@gmail.com";
    public static final String TEST_USER_PASSWORD = "12345678";

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @ChangeSet(order = "001", id = "createUser", author = "skosinskyi")
    public void initUser(MongoDatabase db) {
        MongoCollection<Document> userCollection = db.getCollection("user");
        Document user = new Document()
                .append("email", TEST_USER_EMAIL)
                .append("password", passwordEncoder.encode(TEST_USER_PASSWORD));
        userCollection.insertOne(user);
    }

}