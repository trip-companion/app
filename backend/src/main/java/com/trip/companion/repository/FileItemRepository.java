package com.trip.companion.repository;

import com.trip.companion.domain.file.FileItem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FileItemRepository extends MongoRepository<FileItem, String> {
}
