package com.trip.companion;

import com.trip.companion.extensions.EmbeddedMongoDbExtension;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.junit.jupiter.api.extension.ExtendWith;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@ExtendWith(EmbeddedMongoDbExtension.class)
public @interface EmbeddedMongoDbTest {
}
