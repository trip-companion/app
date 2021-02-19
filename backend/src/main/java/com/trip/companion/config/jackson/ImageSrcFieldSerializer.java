package com.trip.companion.config.jackson;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.trip.companion.error.exception.JsonException;
import java.io.IOException;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Strings;

@Slf4j
public class ImageSrcFieldSerializer extends JsonSerializer<String> {

    public static final String FILES_ENDPOINT = "/api/public/files/";

    @Override
    public void serialize(String fileItemId, JsonGenerator jsonGen, SerializerProvider provider) {
        Optional.ofNullable(fileItemId).ifPresentOrElse(
                id -> write(jsonGen, FILES_ENDPOINT + fileItemId),
                () -> write(jsonGen, Strings.EMPTY));
    }

    private void write(JsonGenerator jsonGenerator, String value) {
        try {
            jsonGenerator.writeString(value);
        } catch (IOException exc) {
            log.error("Failed to write value {} to json", value);
            throw new JsonException("Failed to write value " + value + " to json", exc);
        }
    }
}
