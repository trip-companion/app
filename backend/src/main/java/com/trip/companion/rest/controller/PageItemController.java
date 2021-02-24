package com.trip.companion.rest.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.trip.companion.domain.Language;
import com.trip.companion.domain.page.Page;
import com.trip.companion.domain.page.PageItem;
import com.trip.companion.rest.dto.response.PageItemsResponse;
import com.trip.companion.service.PageItemService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/public/page")
public class PageItemController {

    private final PageItemService service;

    @Autowired
    public PageItemController(PageItemService service) {
        this.service = service;
    }

    @GetMapping("{pageId}/{language}")
    public PageItemsResponse findAllByPage(@PathVariable Page pageId, @PathVariable Language language) {
        return map(service.findAllByPageAndLanguage(pageId, language));
    }

    private PageItemsResponse map(List<PageItem> pageItems) {
        JsonObject result = new JsonObject();
        pageItems.forEach(pageItem -> {
            JsonObject currentNode = result;
            for (String nodeName : pageItem.getItem().split("\\.")) {
                if (!currentNode.has(nodeName)) {
                    currentNode.add(nodeName, new JsonObject());
                }
                currentNode = (JsonObject) currentNode.get(nodeName);
            }
            currentNode.addProperty("text", pageItem.getContent().getText());
            currentNode.addProperty("placeholder", pageItem.getContent().getPlaceholder());
        });
        return new PageItemsResponse(new Gson().toJson(result));
    }

}
