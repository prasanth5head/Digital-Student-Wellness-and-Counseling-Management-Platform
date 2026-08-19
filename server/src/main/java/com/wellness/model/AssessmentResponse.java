package com.wellness.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "assessmentResponses")
public class AssessmentResponse {
    @Id
    private String id;

    @Indexed
    private String studentId;

    private String studentName;
    private String studentRegisterNo;
    private String departmentName;
    private Map<String, Object> answers = new HashMap<>();
    private List<CategoryScore> categoryScores = new ArrayList<>();
    private int overallScore;
    private RiskLevel riskLevel;
    private String summary;
    private List<String> recommendations = new ArrayList<>();
    private LocalDateTime createdAt = LocalDateTime.now();

    public AssessmentResponse() {}

    public AssessmentResponse(String id, String studentId, String studentName, String studentRegisterNo,
                              String departmentName, Map<String, Object> answers, List<CategoryScore> categoryScores,
                              int overallScore, RiskLevel riskLevel, String summary,
                              List<String> recommendations, LocalDateTime createdAt) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentRegisterNo = studentRegisterNo;
        this.departmentName = departmentName;
        this.answers = answers != null ? answers : new HashMap<>();
        this.categoryScores = categoryScores != null ? categoryScores : new ArrayList<>();
        this.overallScore = overallScore;
        this.riskLevel = riskLevel;
        this.summary = summary;
        this.recommendations = recommendations != null ? recommendations : new ArrayList<>();
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String studentId;
        private String studentName;
        private String studentRegisterNo;
        private String departmentName;
        private Map<String, Object> answers = new HashMap<>();
        private List<CategoryScore> categoryScores = new ArrayList<>();
        private int overallScore;
        private RiskLevel riskLevel;
        private String summary;
        private List<String> recommendations = new ArrayList<>();
        private LocalDateTime createdAt = LocalDateTime.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder studentId(String studentId) { this.studentId = studentId; return this; }
        public Builder studentName(String studentName) { this.studentName = studentName; return this; }
        public Builder studentRegisterNo(String studentRegisterNo) { this.studentRegisterNo = studentRegisterNo; return this; }
        public Builder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public Builder answers(Map<String, Object> answers) { this.answers = answers; return this; }
        public Builder categoryScores(List<CategoryScore> categoryScores) { this.categoryScores = categoryScores; return this; }
        public Builder overallScore(int overallScore) { this.overallScore = overallScore; return this; }
        public Builder riskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; return this; }
        public Builder summary(String summary) { this.summary = summary; return this; }
        public Builder recommendations(List<String> recommendations) { this.recommendations = recommendations; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public AssessmentResponse build() {
            return new AssessmentResponse(id, studentId, studentName, studentRegisterNo, departmentName, answers,
                    categoryScores, overallScore, riskLevel, summary, recommendations, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getStudentRegisterNo() { return studentRegisterNo; }
    public void setStudentRegisterNo(String studentRegisterNo) { this.studentRegisterNo = studentRegisterNo; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public Map<String, Object> getAnswers() { return answers; }
    public void setAnswers(Map<String, Object> answers) { this.answers = answers; }
    public List<CategoryScore> getCategoryScores() { return categoryScores; }
    public void setCategoryScores(List<CategoryScore> categoryScores) { this.categoryScores = categoryScores; }
    public int getOverallScore() { return overallScore; }
    public void setOverallScore(int overallScore) { this.overallScore = overallScore; }
    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
