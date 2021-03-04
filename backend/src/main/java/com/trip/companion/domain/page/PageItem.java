package com.trip.companion.domain.page;

import com.trip.companion.domain.Language;
import com.trip.companion.domain.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data
@EqualsAndHashCode(callSuper = true)
public class PageItem extends BaseEntity {

    private Language language;
    private Page page;
    private String item;
    private Content content;

    @Data
    public static class Content {
        private String text;
    }

}
