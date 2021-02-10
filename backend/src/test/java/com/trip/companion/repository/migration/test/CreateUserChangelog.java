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

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @ChangeSet(order = "001", id = "createUser", author = "skosinskyi")
    public void initUser(MongoDatabase db) {
        MongoCollection<Document> userCollection = db.getCollection("user");
        Document user = new Document()
                .append("email", "testUser@gmail.com")
                .append("password", passwordEncoder.encode("12345678"));
        userCollection.insertOne(user);
    }

}