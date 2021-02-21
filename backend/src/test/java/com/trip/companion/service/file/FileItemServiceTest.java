package com.trip.companion.service.file;

import com.trip.companion.domain.file.FileItem;
import com.trip.companion.error.exception.FileException;
import com.trip.companion.repository.FileItemRepository;
import com.trip.companion.service.file.storage.FileStorageService;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
class FileItemServiceTest {

    @Autowired
    private FileItemService fileItemService;
    @MockBean
    private FileItemRepository fileItemRepository;
    @MockBean
    private FileStorageService fileStorageService;

    @Test
    void verifyFileItemAndFileDeleted() {
        String fileItemId = "fileItemId";
        String fileKey = "fileKey";
        String extension = "extension";

        FileItem fileItem = new FileItem();
        fileItem.setId(fileItemId);
        fileItem.setKey(fileKey);
        fileItem.setExtension(extension);

        when(fileItemRepository.findById(fileItemId)).thenReturn(Optional.of(fileItem));

        fileItemService.removeFileItem(fileItemId);

        verify(fileStorageService, times(1)).removeFile(fileKey, extension);
        verify(fileItemRepository, times(1)).delete(fileItem);
    }

    @Test
    void verifyStorageNotCalledIfFileNotExists() {
        String fileItemId = "fileItemId";

        when(fileItemRepository.findById(fileItemId)).thenReturn(Optional.empty());

        fileItemService.removeFileItem(fileItemId);

        verify(fileStorageService, times(0)).removeFile(anyString(), anyString());
        verify(fileItemRepository, times(0)).delete(any());
    }

    @Test
    void assertFileExceptionThrownIfMimeTypeIsWrong() {
        MockMultipartFile file = new MockMultipartFile("test", new byte[]{0, 0, 0, 0});

        assertThrows(FileException.class,
                () -> fileItemService.uploadFile(file), "Failed to detect file mime type");
    }

}