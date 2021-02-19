package com.trip.companion.rest.controller;

import com.trip.companion.service.file.FileItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/public/files")
public class FileItemController {

    private final FileItemService fileItemService;

    @Autowired
    public FileItemController(FileItemService fileItemService) {
        this.fileItemService = fileItemService;
    }

    @GetMapping(value = "{fileId}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public byte[] getBinary(@PathVariable String fileId) {
        return fileItemService.getBinary(fileId);
    }

}
