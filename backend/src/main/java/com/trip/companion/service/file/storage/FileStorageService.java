package com.trip.companion.service.file.storage;

import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    default String generateFileKey() {
        return UUID.randomUUID().toString();
    }

    byte[] getBinaryFile(String fileKey, String extension);

    String uploadFile(MultipartFile multipartFile, String extension);

    void removeFile(String fileKey, String extension);
}
