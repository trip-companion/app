package com.trip.companion.domain.file;

import com.trip.companion.domain.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.extern.slf4j.Slf4j;

@Data
@Slf4j
@EqualsAndHashCode(callSuper = true)
public class FileItem extends BaseEntity {

    private String key;
    private String extension;
    private Long size;

}
