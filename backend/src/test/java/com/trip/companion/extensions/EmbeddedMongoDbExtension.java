package com.trip.companion.extensions;

import com.github.cloudyrock.mongock.driver.mongodb.sync.v4.driver.MongoSync4Driver;
import com.github.cloudyrock.standalone.MongockStandalone;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import de.flapdoodle.embed.mongo.MongodExecutable;
import de.flapdoodle.embed.mongo.MongodStarter;
import de.flapdoodle.embed.mongo.config.IMongodConfig;
import de.flapdoodle.embed.mongo.config.MongodConfigBuilder;
import de.flapdoodle.embed.mongo.config.Net;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.process.runtime.Network;
import org.junit.jupiter.api.extension.AfterAllCallback;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.ExtensionContext;

public class EmbeddedMongoDbExtension implements AfterAllCallback, BeforeAllCallback {
    private static final String CONNECTION_STRING = "mongodb://%s:%d";
    private static final String DB_NAME = "trip-companion";
    private static final String DB_HOST = "localhost";
    private static final int DB_PORT = 30000;
    private static final String MIGRATION_PACKAGE = "com.trip.companion.repository.migration.test";

    private MongodExecutable mongodExecutable;

    @Override
    public void afterAll(ExtensionContext context) {
        mongodExecutable.stop();
    }

    @Override
    public void beforeAll(ExtensionContext context) throws Exception {
        IMongodConfig mongodConfig = new MongodConfigBuilder().version(Version.Main.PRODUCTION)
                .net(new Net(DB_HOST, DB_PORT, Network.localhostIsIPv6()))
                .build();

        MongodStarter starter = MongodStarter.getDefaultInstance();
        mongodExecutable = starter.prepare(mongodConfig);
        mongodExecutable.start();
        MongoClient mongoClient = MongoClients.create(String.format(CONNECTION_STRING, DB_HOST, DB_PORT));
        executeMongock(mongoClient);
    }

    private void executeMongock(MongoClient mongoClient) {
        MongockStandalone.builder()
                .setDriver(MongoSync4Driver.withDefaultLock(mongoClient, DB_NAME))
                .addChangeLogsScanPackage(MIGRATION_PACKAGE)
                .buildRunner()
                .execute();
    }
}
