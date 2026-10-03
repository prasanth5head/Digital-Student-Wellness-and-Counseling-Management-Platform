package com.wellness.dto;

import java.util.Map;

public class MLPredictionRequest {
    private String studentId;
    private String assessmentId;
    private Map<String, Object> features;

    public MLPredictionRequest() {}

    public MLPredictionRequest(String studentId, String assessmentId, Map<String, Object> features) {
        this.studentId = studentId;
        this.assessmentId = assessmentId;
        this.features = features;
    }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getAssessmentId() { return assessmentId; }
    public void setAssessmentId(String assessmentId) { this.assessmentId = assessmentId; }

    public Map<String, Object> getFeatures() { return features; }
    public void setFeatures(Map<String, Object> features) { this.features = features; }
}
