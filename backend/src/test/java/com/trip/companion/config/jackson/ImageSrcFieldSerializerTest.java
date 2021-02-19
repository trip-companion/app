package com.trip.companion.config.jackson;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.trip.companion.error.exception.JsonException;
import java.io.IOException;
import org.apache.logging.log4j.util.Strings;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

class ImageSrcFieldSerializerTest {

    private final ImageSrcFieldSerializer serializer = new ImageSrcFieldSerializer();

    @Test
    void verifyPrefixAppendedIfValuePresent() throws IOException {
        String fileItemId = "fileItemId";
        JsonGenerator jsonGen = mock(JsonGenerator.class);
        SerializerProvider provider = mock(SerializerProvider.class);

        serializer.serialize(fileItemId, jsonGen, provider);

        verify(jsonGen, times(1))
                .writeString(ImageSrcFieldSerializer.FILES_ENDPOINT + fileItemId);
    }

    @Test
    void verifyEmptyStringSerializedIfValueMissing() throws IOException {
        JsonGenerator jsonGen = mock(JsonGenerator.class);
        SerializerProvider provider = mock(SerializerProvider.class);

        serializer.serialize(null, jsonGen, provider);

        verify(jsonGen, times(1))
                .writeString(Strings.EMPTY);
    }

    @Test
    void verifyJsonExceptionThrownIfFailedToWrite() throws IOException {
        JsonGenerator jsonGen = mock(JsonGenerator.class);
        SerializerProvider provider = mock(SerializerProvider.class);

        doThrow(IOException.class).when(jsonGen).writeString(anyString());

        assertThrows(JsonException.class, () -> serializer.serialize(null, jsonGen, provider));
    }

}