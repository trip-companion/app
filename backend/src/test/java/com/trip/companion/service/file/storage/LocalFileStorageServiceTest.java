package com.trip.companion.service.file.storage;

import com.trip.companion.error.exception.FileException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
class LocalFileStorageServiceTest {

    @Autowired
    private LocalFileStorageService storageService;

    @Test
    void assertFileDeleted() {
        String extension = ".txt";
        MockMultipartFile file = new MockMultipartFile("test", new byte[]{0, 0, 0, 0});

        String fileKey = storageService.uploadFile(file, extension);

        storageService.removeFile(fileKey, extension);

        assertThrows(FileException.class, () -> storageService.getBinaryFile(fileKey, extension));
    }

}