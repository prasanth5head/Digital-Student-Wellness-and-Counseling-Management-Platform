package com.wellness.repository;

import com.wellness.model.Bookmark;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends MongoRepository<Bookmark, String> {
    List<Bookmark> findByUserId(String userId);
    Optional<Bookmark> findByUserIdAndResourceId(String userId, String resourceId);
    boolean existsByUserIdAndResourceId(String userId, String resourceId);
    void deleteByUserIdAndResourceId(String userId, String resourceId);
}
