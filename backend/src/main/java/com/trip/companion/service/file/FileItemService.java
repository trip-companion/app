package com.trip.companion.service.file;

import com.trip.companion.domain.file.FileItem;
import com.trip.companion.error.exception.FileException;
import com.trip.companion.error.exception.NoDataFoundException;
import com.trip.companion.repository.FileItemRepository;
import com.trip.companion.service.file.storage.FileStorageService;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.mime.MimeTypeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import static org.apache.tika.mime.MimeTypes.getDefaultMimeTypes;

@Service
@Slf4j
public class FileItemService {

    private final FileStorageService fileStorageService;
    private final FileItemRepository fileItemRepository;

    @Autowired
    public FileItemService(FileStorageService fileStorageService, FileItemRepository fileItemRepository) {
        this.fileStorageService = fileStorageService;
        this.fileItemRepository = fileItemRepository;
    }

    public FileItem getById(String fileItemId) {
        return fileItemRepository.findById(fileItemId)
                .orElseThrow(() -> new NoDataFoundException("File item not found by id " + fileItemId));
    }

    public byte[] getBinary(String fileItemId) {
        FileItem fileItem = getById(fileItemId);
        return fileStorageService.getBinaryFile(fileItem.getKey(), fileItem.getExtension());
    }

    public FileItem uploadFile(MultipartFile file) {
        String extension = getFileExtension(file);
        String key = fileStorageService.uploadFile(file, extension);
        FileItem fileItem = new FileItem();
        fileItem.setKey(key);
        fileItem.setExtension(extension);
        fileItem.setSize(file.getSize());
        FileItem createdFileItem = fileItemRepository.save(fileItem);
        log.debug("Created file item with id {}, file key {}", createdFileItem.getId(), createdFileItem.getKey());
        return createdFileItem;
    }

    public FileItem uploadImage(MultipartFile file) {
        if (isImage(file)) {
            return uploadFile(file);
        } else {
            throw new FileException("File " + file.getOriginalFilename() + " is not an image file, content-type: "
                    + file.getContentType());
        }
    }

    private boolean isImage(MultipartFile file) {
        return Optional.ofNullable(file.getContentType()).map(type -> type.startsWith("image")).orElse(false);
    }

    @Async
    public void removeFileItemAsync(String fileItemId) {
        removeFileItem(fileItemId);
    }

    public void removeFileItem(String fileItemId) {
        fileItemRepository.findById(fileItemId).ifPresent(this::removeFileItem);
    }

    private void removeFileItem(FileItem fileItem) {
        fileStorageService.removeFile(fileItem.getKey(), fileItem.getExtension());
        fileItemRepository.delete(fileItem);
        log.info("Deleted file item with id {}, file key {}", fileItem.getId(), fileItem.getKey());
    }

    private String getFileExtension(MultipartFile file) {
        try {
            return getDefaultMimeTypes().forName(file.getContentType()).getExtension();
        } catch (MimeTypeException exc) {
            throw new FileException("Failed to detect file mime type");
        }
    }
}
