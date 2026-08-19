package com.wellness.controller;

import com.wellness.dto.ApiResponse;
import com.wellness.dto.StudentDTO;
import com.wellness.dto.StudentDashboardDTO;
import com.wellness.model.Appointment;
import com.wellness.model.AssessmentResponse;
import com.wellness.model.CounselingRequest;
import com.wellness.model.CounselingSession;
import com.wellness.model.Student;
import com.wellness.security.UserDetailsImpl;
import com.wellness.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
public class StudentController {

    private final StudentService studentService;
    private final AssessmentService assessmentService;
    private final AppointmentService appointmentService;
    private final CounselingRequestService counselingRequestService;
    private final CounselingSessionService counselingSessionService;
    private final AuthService authService;

    public StudentController(StudentService studentService, AssessmentService assessmentService,
                             AppointmentService appointmentService, CounselingRequestService counselingRequestService,
                             CounselingSessionService counselingSessionService, AuthService authService) {
        this.studentService = studentService;
        this.assessmentService = assessmentService;
        this.appointmentService = appointmentService;
        this.counselingRequestService = counselingRequestService;
        this.counselingSessionService = counselingSessionService;
        this.authService = authService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<StudentDashboardDTO>> getDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        StudentDashboardDTO dashboard = studentService.getStudentDashboard(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(dashboard));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentDTO>> getProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Student student = studentService.getStudentByUserId(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(authService.mapToStudentDTO(student)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<StudentDTO>> updateProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody StudentDTO dto) {
        Student updated = studentService.updateStudentProfile(userDetails.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", authService.mapToStudentDTO(updated)));
    }

    @GetMapping("/assessments")
    public ResponseEntity<ApiResponse<List<AssessmentResponse>>> getAssessments(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Student student = studentService.getStudentByUserId(userDetails.getId());
        List<AssessmentResponse> history = assessmentService.getStudentAssessmentHistory(student.getId());
        return ResponseEntity.ok(ApiResponse.ok(history));
    }

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<List<Appointment>>> getAppointments(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Student student = studentService.getStudentByUserId(userDetails.getId());
        List<Appointment> appointments = appointmentService.getAppointmentsForStudent(student.getId());
        return ResponseEntity.ok(ApiResponse.ok(appointments));
    }

    @GetMapping("/requests")
    public ResponseEntity<ApiResponse<List<CounselingRequest>>> getRequests(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Student student = studentService.getStudentByUserId(userDetails.getId());
        List<CounselingRequest> requests = counselingRequestService.getRequestsForStudent(student.getId());
        return ResponseEntity.ok(ApiResponse.ok(requests));
    }

    @GetMapping("/sessions")
    public ResponseEntity<ApiResponse<List<CounselingSession>>> getSessions(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Student student = studentService.getStudentByUserId(userDetails.getId());
        List<CounselingSession> sessions = counselingSessionService.getSessionsForStudent(student.getId());
        return ResponseEntity.ok(ApiResponse.ok(sessions));
    }
}
