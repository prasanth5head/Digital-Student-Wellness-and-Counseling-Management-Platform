package com.wellness.controller;

import com.wellness.dto.AdminAnalyticsOverviewDTO;
import com.wellness.dto.ApiResponse;
import com.wellness.model.*;
import com.wellness.repository.UserRepository;
import com.wellness.service.AdminAnalyticsService;
import com.wellness.service.AssessmentService;
import com.wellness.service.StudentService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminAnalyticsService adminAnalyticsService;
    private final AssessmentService assessmentService;
    private final StudentService studentService;
    private final UserRepository userRepository;

    public AdminController(AdminAnalyticsService adminAnalyticsService,
                           AssessmentService assessmentService,
                           StudentService studentService,
                           UserRepository userRepository) {
        this.adminAnalyticsService = adminAnalyticsService;
        this.assessmentService = assessmentService;
        this.studentService = studentService;
        this.userRepository = userRepository;
    }

    @GetMapping("/analytics/overview")
    public ResponseEntity<ApiResponse<AdminAnalyticsOverviewDTO>> getAnalyticsOverview() {
        AdminAnalyticsOverviewDTO dto = adminAnalyticsService.getAnalyticsOverview();
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse<User>> toggleUserStatus(@PathVariable String id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setActive(!user.isActive());
        return ResponseEntity.ok(ApiResponse.ok("User status updated", userRepository.save(user)));
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<Page<Student>>> getStudents(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<Student> students = studentService.searchStudents(search, page, size);
        return ResponseEntity.ok(ApiResponse.ok(students));
    }

    @GetMapping("/questions")
    public ResponseEntity<ApiResponse<List<AssessmentQuestion>>> getAllQuestionsAdmin() {
        return ResponseEntity.ok(ApiResponse.ok(assessmentService.getAllQuestionsAdmin()));
    }

    @PostMapping("/questions")
    public ResponseEntity<ApiResponse<AssessmentQuestion>> createQuestion(@RequestBody AssessmentQuestion question) {
        AssessmentQuestion saved = assessmentService.createQuestion(question);
        return ResponseEntity.ok(ApiResponse.ok("Question created", saved));
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<ApiResponse<AssessmentQuestion>> updateQuestion(
            @PathVariable String id,
            @RequestBody AssessmentQuestion question) {
        AssessmentQuestion updated = assessmentService.updateQuestion(id, question);
        return ResponseEntity.ok(ApiResponse.ok("Question updated", updated));
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(@PathVariable String id) {
        assessmentService.deleteQuestion(id);
        return ResponseEntity.ok(ApiResponse.ok("Question deleted", null));
    }

    @GetMapping("/announcements")
    public ResponseEntity<ApiResponse<List<Announcement>>> getAnnouncements() {
        return ResponseEntity.ok(ApiResponse.ok(adminAnalyticsService.getActiveAnnouncements()));
    }

    @PostMapping("/announcements")
    public ResponseEntity<ApiResponse<Announcement>> createAnnouncement(@RequestBody Announcement announcement) {
        Announcement saved = adminAnalyticsService.createAnnouncement(announcement);
        return ResponseEntity.ok(ApiResponse.ok("Announcement published", saved));
    }

    @DeleteMapping("/announcements/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAnnouncement(@PathVariable String id) {
        adminAnalyticsService.deleteAnnouncement(id);
        return ResponseEntity.ok(ApiResponse.ok("Announcement deleted", null));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<Page<AuditLog>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminAnalyticsService.getAuditLogs(page, size)));
    }
}
