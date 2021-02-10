package com.trip.companion.service;

import com.trip.companion.domain.Language;
import com.trip.companion.domain.page.Page;
import com.trip.companion.domain.page.PageItem;
import com.trip.companion.repository.PageItemRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PageItemService {

    private final PageItemRepository repository;

    @Autowired
    public PageItemService(PageItemRepository repository) {
        this.repository = repository;
    }

    public List<PageItem> findAllByPageAndLanguage(Page page, Language language) {
        return repository.findAllByPageAndLanguage(page, language);
    }
}
