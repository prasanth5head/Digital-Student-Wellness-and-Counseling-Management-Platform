package com.wellness.controller;

import com.wellness.dto.ApiResponse;
import com.wellness.dto.AssessmentSubmitRequest;
import com.wellness.model.AssessmentQuestion;
import com.wellness.model.AssessmentResponse;
import com.wellness.security.UserDetailsImpl;
import com.wellness.service.AssessmentService;
import com.wellness.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.wellness.dto.MLHealthResponse;
import com.wellness.model.MLPrediction;
import com.wellness.service.MLPredictionService;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;
    private final StudentService studentService;
    private final MLPredictionService mlPredictionService;

    public AssessmentController(AssessmentService assessmentService, StudentService studentService, MLPredictionService mlPredictionService) {
        this.assessmentService = assessmentService;
        this.studentService = studentService;
        this.mlPredictionService = mlPredictionService;
    }

    @GetMapping("/ml/health")
    public ResponseEntity<ApiResponse<MLHealthResponse>> getMLHealth() {
        MLHealthResponse health = mlPredictionService.checkHealth();
        return ResponseEntity.ok(ApiResponse.ok(health));
    }

    @GetMapping("/{id}/prediction")
    public ResponseEntity<ApiResponse<MLPrediction>> getPredictionByAssessmentId(@PathVariable String id) {
        return mlPredictionService.getPredictionByAssessmentId(id)
                .map(pred -> ResponseEntity.ok(ApiResponse.ok(pred)))
                .orElse(ResponseEntity.ok(ApiResponse.ok(null)));
    }

    @GetMapping("/questions")
    public ResponseEntity<ApiResponse<List<AssessmentQuestion>>> getQuestions() {
        List<AssessmentQuestion> questions = assessmentService.getAllQuestions();
        return ResponseEntity.ok(ApiResponse.ok(questions));
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<AssessmentResponse>> submitAssessment(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody AssessmentSubmitRequest request) {
        var student = studentService.getStudentByUserId(userDetails.getId());
        AssessmentResponse response = assessmentService.submitAssessment(student.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Assessment submitted successfully", response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<AssessmentResponse>>> getHistory(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        var student = studentService.getStudentByUserId(userDetails.getId());
        List<AssessmentResponse> history = assessmentService.getStudentAssessmentHistory(student.getId());
        return ResponseEntity.ok(ApiResponse.ok(history));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssessmentResponse>> getById(@PathVariable String id) {
        AssessmentResponse response = assessmentService.getAssessmentById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
