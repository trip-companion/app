package com.trip.companion.config.jackson;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.NullSerializer;
import java.io.IOException;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.util.Optional;
import java.util.stream.Stream;

public class CustomNullValueSerializer extends JsonSerializer<Object> {

    private static final JsonSerializer<Object> IMAGE_SRC_SERIALIZER = new ImageSrcFieldSerializer();
    private static final JsonSerializer<Object> DEFAULT_NULL_SERIALIZER = NullSerializer.instance;

    @Override
    public void serialize(Object value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        if (isAnnotationPresent(gen, ImageSrc.class)) {
            IMAGE_SRC_SERIALIZER.serialize(value, gen, serializers);
        } else {
            DEFAULT_NULL_SERIALIZER.serialize(value, gen, serializers);
        }
    }

    private boolean isAnnotationPresent(JsonGenerator gen, Class<? extends Annotation> annotationClass) {
        try {
            String fieldName = gen.getOutputContext().getCurrentName();
            return Stream.of(gen.getOutputContext().getCurrentValue().getClass().getDeclaredFields())
                    .filter(field -> field.getName().equals(fieldName) || isRenamedField(field, fieldName))
                    .findFirst()
                    .map(field -> field.isAnnotationPresent(annotationClass))
                    .orElse(false);
        } catch (Exception exc) {
            return false;
        }
    }

    private boolean isRenamedField(Field field, String name) {
        return Optional.ofNullable(field.getAnnotation(JsonProperty.class))
                .map(ann -> ann.value().equals(name))
                .orElse(false);
    }
}
