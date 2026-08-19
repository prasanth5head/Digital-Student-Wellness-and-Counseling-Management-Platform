package com.wellness.controller;

import com.wellness.dto.*;
import com.wellness.model.*;
import com.wellness.security.UserDetailsImpl;
import com.wellness.service.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/counselor")
public class CounselorController {

    private final CounselorService counselorService;
    private final CounselingRequestService counselingRequestService;
    private final CounselingSessionService counselingSessionService;
    private final AppointmentService appointmentService;
    private final AuthService authService;

    public CounselorController(CounselorService counselorService, CounselingRequestService counselingRequestService,
                               CounselingSessionService counselingSessionService, AppointmentService appointmentService,
                               AuthService authService) {
        this.counselorService = counselorService;
        this.counselingRequestService = counselingRequestService;
        this.counselingSessionService = counselingSessionService;
        this.appointmentService = appointmentService;
        this.authService = authService;
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<Counselor>>> getAllCounselors() {
        List<Counselor> counselors = counselorService.getAllActiveCounselors();
        return ResponseEntity.ok(ApiResponse.ok(counselors));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<CounselorDashboardDTO>> getDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        CounselorDashboardDTO dashboard = counselorService.getCounselorDashboard(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(dashboard));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<CounselorDTO>> getProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Counselor counselor = counselorService.getCounselorByUserId(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(authService.mapToCounselorDTO(counselor)));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<CounselorDTO>> updateProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody CounselorDTO dto) {
        Counselor updated = counselorService.updateCounselorProfile(userDetails.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", authService.mapToCounselorDTO(updated)));
    }

    @GetMapping("/students/{studentId}/wellness-profile")
    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStudentWellnessProfile(@PathVariable String studentId) {
        Map<String, Object> profile = counselorService.getStudentWellnessProfile(studentId);
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @GetMapping("/appointments")
    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Appointment>>> getAppointments(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Counselor counselor = counselorService.getCounselorByUserId(userDetails.getId());
        List<Appointment> appointments = appointmentService.getAppointmentsForCounselor(counselor.getId());
        return ResponseEntity.ok(ApiResponse.ok(appointments));
    }

    @GetMapping("/requests")
    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<CounselingRequest>>> getRequests(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Counselor counselor = counselorService.getCounselorByUserId(userDetails.getId());
        List<CounselingRequest> requests = counselingRequestService.getRequestsForCounselor(counselor.getId());
        return ResponseEntity.ok(ApiResponse.ok(requests));
    }

    @PutMapping("/requests/{id}/status")
    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<CounselingRequest>> updateRequestStatus(
            @PathVariable String id,
            @RequestParam RequestStatus status,
            @RequestParam(required = false) String notes,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        CounselingRequest updated = counselingRequestService.updateRequestStatus(id, status, notes, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Request status updated to " + status, updated));
    }

    @PostMapping("/sessions")
    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<CounselingSession>> createSession(
            @Valid @RequestBody SessionCreateDTO dto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        CounselingSession session = counselingSessionService.createSession(dto, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Session logged and recommendations recorded", session));
    }

    @PostMapping("/notes")
    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<CounselorNote>> saveClinicalNote(
            @Valid @RequestBody CounselorNoteDTO dto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        CounselorNote note = counselingSessionService.saveCounselorNote(dto, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Confidential clinical note saved", note));
    }

    @GetMapping("/notes/student/{studentId}")
    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<CounselorNote>>> getNotesForStudent(@PathVariable String studentId) {
        List<CounselorNote> notes = counselingSessionService.getCounselorNotesForStudent(studentId);
        return ResponseEntity.ok(ApiResponse.ok(notes));
    }
}
