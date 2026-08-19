package com.wellness.controller;

import com.wellness.dto.ApiResponse;
import com.wellness.model.WellnessResource;
import com.wellness.security.UserDetailsImpl;
import com.wellness.service.StudentService;
import com.wellness.service.WellnessResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final WellnessResourceService resourceService;
    private final StudentService studentService;

    public ResourceController(WellnessResourceService resourceService, StudentService studentService) {
        this.resourceService = resourceService;
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WellnessResource>>> getAllResources(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        List<WellnessResource> list = resourceService.getAllResources(category, search);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WellnessResource>> getResourceById(@PathVariable String id) {
        WellnessResource resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(ApiResponse.ok(resource));
    }

    @GetMapping("/recommended")
    public ResponseEntity<ApiResponse<List<WellnessResource>>> getRecommended(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.ok(ApiResponse.ok(resourceService.getAllResources(null, null).stream().limit(6).toList()));
        }
        var student = studentService.getStudentByUserId(userDetails.getId());
        List<WellnessResource> list = resourceService.getRecommendationsForStudent(student.getId());
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/{id}/bookmark")
    public ResponseEntity<ApiResponse<Boolean>> toggleBookmark(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        boolean bookmarked = resourceService.toggleBookmark(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(bookmarked ? "Resource bookmarked" : "Bookmark removed", bookmarked));
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<ApiResponse<List<WellnessResource>>> getMyBookmarks(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<WellnessResource> list = resourceService.getUserBookmarks(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<WellnessResource>> createResource(@RequestBody WellnessResource resource) {
        WellnessResource saved = resourceService.createResource(resource);
        return ResponseEntity.ok(ApiResponse.ok("Resource created", saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<WellnessResource>> updateResource(
            @PathVariable String id,
            @RequestBody WellnessResource resource) {
        WellnessResource updated = resourceService.updateResource(id, resource);
        return ResponseEntity.ok(ApiResponse.ok("Resource updated", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok(ApiResponse.ok("Resource deleted", null));
    }
}
