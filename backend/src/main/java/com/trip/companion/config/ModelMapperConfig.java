package com.trip.companion.config;

import com.trip.companion.domain.user.User;
import com.trip.companion.rest.controller.dto.response.UserResponse;
import java.util.Optional;
import org.apache.logging.log4j.util.Strings;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {
    public static final String FILES_ENDPOINT = "/api/public/files/";

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        modelMapper.typeMap(User.class, UserResponse.class).setPostConverter(getUserToUserResponseConverter());
        return modelMapper;
    }

    private Converter<User, UserResponse> getUserToUserResponseConverter() {
        return context -> {
            UserResponse destination = context.getDestination();
            Optional.ofNullable(context.getSource().getAvatarId()).ifPresentOrElse(
                    id -> destination.setAvatarSrc(FILES_ENDPOINT + id),
                    () -> destination.setAvatarSrc(Strings.EMPTY));
            return destination;
        };
    }

}
