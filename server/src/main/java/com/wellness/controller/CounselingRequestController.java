package com.wellness.controller;

import com.wellness.dto.ApiResponse;
import com.wellness.dto.CounselingRequestCreateDTO;
import com.wellness.model.CounselingRequest;
import com.wellness.security.UserDetailsImpl;
import com.wellness.service.CounselingRequestService;
import com.wellness.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class CounselingRequestController {

    private final CounselingRequestService requestService;
    private final StudentService studentService;

    public CounselingRequestController(CounselingRequestService requestService, StudentService studentService) {
        this.requestService = requestService;
        this.studentService = studentService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<CounselingRequest>> createRequest(
            @Valid @RequestBody CounselingRequestCreateDTO dto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        var student = studentService.getStudentByUserId(userDetails.getId());
        CounselingRequest request = requestService.createRequest(student.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("Counseling request submitted", request));
    }

    @GetMapping("/student")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<CounselingRequest>>> getStudentRequests(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        var student = studentService.getStudentByUserId(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(requestService.getRequestsForStudent(student.getId())));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getAllRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(requestService.getAllRequests(page, size)));
    }
}
