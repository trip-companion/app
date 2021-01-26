package com.trip.companion;

import com.github.cloudyrock.spring.v5.EnableMongock;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.mongo.embedded.EmbeddedMongoAutoConfiguration;

@EnableMongock
@SpringBootApplication(exclude = EmbeddedMongoAutoConfiguration.class)
public class TripCompanionApplication {

    public static void main(String[] args) {
        SpringApplication.run(TripCompanionApplication.class);
    }

}
