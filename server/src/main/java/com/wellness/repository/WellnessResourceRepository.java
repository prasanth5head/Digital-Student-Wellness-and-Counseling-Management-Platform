package com.wellness.repository;

import com.wellness.model.WellnessResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WellnessResourceRepository extends MongoRepository<WellnessResource, String> {
    List<WellnessResource> findByCategory(String category);
    List<WellnessResource> findByFeaturedTrue();
    List<WellnessResource> findByCategoryIn(List<String> categories);
    Page<WellnessResource> findByTitleContainingIgnoreCaseOrTagsContainingIgnoreCase(String title, String tag, Pageable pageable);
}
