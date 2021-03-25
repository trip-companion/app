package com.trip.companion.service;

import com.trip.companion.domain.Language;
import com.trip.companion.error.exception.NoDataFoundException;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

@Service
public class PageItemService {

    public String findAllByPageAndLanguage(String page, Language language) {
        try {
            File file = ResourceUtils.getFile(String.format("classpath:translation/%s/%s.json",
                    page.toLowerCase(), language.name().toLowerCase()));
            return Files.readString(file.toPath());
        } catch (IOException e) {
            throw new NoDataFoundException("Failed to read data from file");
        }
    }
}
