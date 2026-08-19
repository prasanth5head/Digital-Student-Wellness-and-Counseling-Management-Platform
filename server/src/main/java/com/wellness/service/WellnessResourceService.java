package com.wellness.service;

import com.wellness.exception.ResourceNotFoundException;
import com.wellness.model.AssessmentResponse;
import com.wellness.model.Bookmark;
import com.wellness.model.CategoryScore;
import com.wellness.model.Student;
import com.wellness.model.WellnessResource;
import com.wellness.repository.AssessmentResponseRepository;
import com.wellness.repository.BookmarkRepository;
import com.wellness.repository.StudentRepository;
import com.wellness.repository.WellnessResourceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class WellnessResourceService {

    private static final Logger log = LoggerFactory.getLogger(WellnessResourceService.class);

    private final WellnessResourceRepository resourceRepository;
    private final BookmarkRepository bookmarkRepository;
    private final StudentRepository studentRepository;
    private final AssessmentResponseRepository responseRepository;

    public WellnessResourceService(WellnessResourceRepository resourceRepository, BookmarkRepository bookmarkRepository,
                                  StudentRepository studentRepository, AssessmentResponseRepository responseRepository) {
        this.resourceRepository = resourceRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.studentRepository = studentRepository;
        this.responseRepository = responseRepository;
    }

    public List<WellnessResource> getAllResources(String category, String search) {
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("ALL")) {
            return resourceRepository.findByCategory(category);
        }
        return resourceRepository.findAll();
    }

    public Page<WellnessResource> getResourcesPaginated(String search, int page, int size) {
        if (search != null && !search.isBlank()) {
            return resourceRepository.findByTitleContainingIgnoreCaseOrTagsContainingIgnoreCase(search, search, PageRequest.of(page, size));
        }
        return resourceRepository.findAll(PageRequest.of(page, size));
    }

    public WellnessResource getResourceById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    public WellnessResource createResource(WellnessResource resource) {
        if (resource.getCreatedAt() == null) {
            resource.setCreatedAt(LocalDateTime.now());
        }
        return resourceRepository.save(resource);
    }

    public WellnessResource updateResource(String id, WellnessResource updated) {
        WellnessResource existing = getResourceById(id);
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setCategory(updated.getCategory());
        existing.setAuthor(updated.getAuthor());
        existing.setImageUrl(updated.getImageUrl());
        existing.setVideoUrl(updated.getVideoUrl());
        existing.setExternalLink(updated.getExternalLink());
        existing.setTags(updated.getTags());
        existing.setReadTime(updated.getReadTime());
        existing.setContentMarkdown(updated.getContentMarkdown());
        existing.setFeatured(updated.isFeatured());
        return resourceRepository.save(existing);
    }

    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }

    public boolean toggleBookmark(String userId, String resourceId) {
        WellnessResource res = getResourceById(resourceId);
        Optional<Bookmark> opt = bookmarkRepository.findByUserIdAndResourceId(userId, resourceId);
        if (opt.isPresent()) {
            bookmarkRepository.delete(opt.get());
            res.setBookmarkCount(Math.max(0, res.getBookmarkCount() - 1));
            resourceRepository.save(res);
            return false;
        } else {
            Bookmark bookmark = Bookmark.builder()
                    .userId(userId)
                    .resourceId(resourceId)
                    .createdAt(LocalDateTime.now())
                    .build();
            bookmarkRepository.save(bookmark);
            res.setBookmarkCount(res.getBookmarkCount() + 1);
            resourceRepository.save(res);
            return true;
        }
    }

    public List<WellnessResource> getUserBookmarks(String userId) {
        List<Bookmark> bookmarks = bookmarkRepository.findByUserId(userId);
        List<String> resourceIds = bookmarks.stream().map(Bookmark::getResourceId).collect(Collectors.toList());
        return resourceRepository.findAllById(resourceIds);
    }

    public List<WellnessResource> getRecommendationsForStudent(String studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null) {
            return resourceRepository.findByFeaturedTrue();
        }

        List<AssessmentResponse> responses = responseRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
        if (responses.isEmpty()) {
            return resourceRepository.findByFeaturedTrue();
        }

        AssessmentResponse latest = responses.get(0);
        List<String> targetCategories = new ArrayList<>();

        if (latest.getCategoryScores() != null) {
            for (CategoryScore cs : latest.getCategoryScores()) {
                if (cs.getPercentage() < 70.0) {
                    targetCategories.add(cs.getCategory());
                }
            }
        }

        if (targetCategories.isEmpty()) {
            targetCategories.add("Meditation & Mindfulness");
            targetCategories.add("Self-Care");
        }

        List<WellnessResource> matched = resourceRepository.findByCategoryIn(targetCategories);
        if (matched.isEmpty()) {
            return resourceRepository.findAll().stream().limit(6).collect(Collectors.toList());
        }
        return matched.stream().limit(6).collect(Collectors.toList());
    }
}
