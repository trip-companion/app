package com.trip.companion.repository;

import com.trip.companion.domain.Language;
import com.trip.companion.domain.page.Page;
import com.trip.companion.domain.page.PageItem;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PageItemRepository extends MongoRepository<PageItem, Long> {

    List<PageItem> findAllByPageAndLanguage(Page page, Language language);

}
