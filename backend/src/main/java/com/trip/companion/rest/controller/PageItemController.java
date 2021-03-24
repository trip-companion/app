package com.trip.companion.rest.controller;

import com.trip.companion.domain.Language;
import com.trip.companion.service.PageItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/public/pages")
public class PageItemController {

    private final PageItemService service;

    @Autowired
    public PageItemController(PageItemService service) {
        this.service = service;
    }

    @GetMapping(value = "{pageId}/{language}", produces = MediaType.APPLICATION_JSON_VALUE)
    public String findAllByPage(@PathVariable String pageId, @PathVariable Language language) {
        return service.findAllByPageAndLanguage(pageId, language);
    }

}
