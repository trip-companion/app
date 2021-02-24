package com.trip.companion.domain;

import com.trip.companion.domain.base.BaseEntity;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data
@EqualsAndHashCode(callSuper = true)
public class Skill extends BaseEntity {

    private List<LanguageItem> items;

    public String getDisplayName(Language language) {
        return items.stream()
                .filter(item -> item.getLanguage().equals(language))
                .findFirst()
                .map(LanguageItem::getName)
                .orElse(null);
    }

}
