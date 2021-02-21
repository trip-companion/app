package com.trip.companion.service.file.storage;

import com.trip.companion.error.exception.FileException;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import javax.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.compress.utils.IOUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
public class LocalFileStorageService implements FileStorageService {

    private static final String STORAGE_PATH = "storage";

    private Path getPath(String key, String extension) {
        return Paths.get(STORAGE_PATH, key + extension);
    }

    @PostConstruct
    private void init() throws IOException {
        if (!Files.exists(Paths.get(STORAGE_PATH))) {
            Files.createDirectory(Paths.get(STORAGE_PATH));
        }
    }

    @Override
    public byte[] getBinaryFile(String fileKey, String extension) {
        String path = getPath(fileKey, extension).toString();
        try (InputStream in = new FileInputStream(new File(path))) {
            return IOUtils.toByteArray(in);
        } catch (IOException exc) {
            log.error("Failed to read file {}: {}", path, exc);
            throw new FileException(exc.getMessage(), exc);
        }
    }

    @Override
    public String uploadFile(MultipartFile multipartFile, String extension) {
        String fileKey = generateFileKey();
        Path path = getPath(fileKey, extension);
        try {
            multipartFile.transferTo(path);
            log.debug("Created new file with key {}", fileKey);
            return fileKey;
        } catch (IOException exc) {
            log.error("Failed to save file {}: {}", path, exc);
            throw new FileException("Failed to save file", exc);
        }
    }

    @Override
    public void removeFile(String fileKey, String extension) {
        try {
            Path path = getPath(fileKey, extension);
            Files.delete(path);
            log.info("Removed file {}{}", fileKey, extension);
        } catch (IOException exc) {
            log.error("Failed to remove file {}{}: {}", fileKey, extension, exc);
        }
    }
}
