package com.wellness.dto;

import java.util.Map;

public class DepartmentAnalyticsDTO {
    private String departmentId;
    private String departmentCode;
    private String departmentName;
    private int totalStudents;
    private double averageWellnessScore;
    private int highRiskCount;
    private int moderateRiskCount;
    private int lowRiskCount;
    private int totalCounselingRequests;
    private int completedSessions;
    private double assessmentParticipationRate;
    private Map<String, Double> categoryAverages;

    public DepartmentAnalyticsDTO() {}

    public DepartmentAnalyticsDTO(String departmentId, String departmentCode, String departmentName,
                                  int totalStudents, double averageWellnessScore, int highRiskCount,
                                  int moderateRiskCount, int lowRiskCount, int totalCounselingRequests,
                                  int completedSessions, double assessmentParticipationRate,
                                  Map<String, Double> categoryAverages) {
        this.departmentId = departmentId;
        this.departmentCode = departmentCode;
        this.departmentName = departmentName;
        this.totalStudents = totalStudents;
        this.averageWellnessScore = averageWellnessScore;
        this.highRiskCount = highRiskCount;
        this.moderateRiskCount = moderateRiskCount;
        this.lowRiskCount = lowRiskCount;
        this.totalCounselingRequests = totalCounselingRequests;
        this.completedSessions = completedSessions;
        this.assessmentParticipationRate = assessmentParticipationRate;
        this.categoryAverages = categoryAverages;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String departmentId;
        private String departmentCode;
        private String departmentName;
        private int totalStudents;
        private double averageWellnessScore;
        private int highRiskCount;
        private int moderateRiskCount;
        private int lowRiskCount;
        private int totalCounselingRequests;
        private int completedSessions;
        private double assessmentParticipationRate;
        private Map<String, Double> categoryAverages;

        public Builder departmentId(String departmentId) { this.departmentId = departmentId; return this; }
        public Builder departmentCode(String departmentCode) { this.departmentCode = departmentCode; return this; }
        public Builder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public Builder totalStudents(int totalStudents) { this.totalStudents = totalStudents; return this; }
        public Builder averageWellnessScore(double averageWellnessScore) { this.averageWellnessScore = averageWellnessScore; return this; }
        public Builder highRiskCount(int highRiskCount) { this.highRiskCount = highRiskCount; return this; }
        public Builder moderateRiskCount(int moderateRiskCount) { this.moderateRiskCount = moderateRiskCount; return this; }
        public Builder lowRiskCount(int lowRiskCount) { this.lowRiskCount = lowRiskCount; return this; }
        public Builder totalCounselingRequests(int totalCounselingRequests) { this.totalCounselingRequests = totalCounselingRequests; return this; }
        public Builder completedSessions(int completedSessions) { this.completedSessions = completedSessions; return this; }
        public Builder assessmentParticipationRate(double assessmentParticipationRate) { this.assessmentParticipationRate = assessmentParticipationRate; return this; }
        public Builder categoryAverages(Map<String, Double> categoryAverages) { this.categoryAverages = categoryAverages; return this; }

        public DepartmentAnalyticsDTO build() {
            return new DepartmentAnalyticsDTO(departmentId, departmentCode, departmentName, totalStudents,
                    averageWellnessScore, highRiskCount, moderateRiskCount, lowRiskCount, totalCounselingRequests,
                    completedSessions, assessmentParticipationRate, categoryAverages);
        }
    }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public int getTotalStudents() { return totalStudents; }
    public void setTotalStudents(int totalStudents) { this.totalStudents = totalStudents; }
    public double getAverageWellnessScore() { return averageWellnessScore; }
    public void setAverageWellnessScore(double averageWellnessScore) { this.averageWellnessScore = averageWellnessScore; }
    public int getHighRiskCount() { return highRiskCount; }
    public void setHighRiskCount(int highRiskCount) { this.highRiskCount = highRiskCount; }
    public int getModerateRiskCount() { return moderateRiskCount; }
    public void setModerateRiskCount(int moderateRiskCount) { this.moderateRiskCount = moderateRiskCount; }
    public int getLowRiskCount() { return lowRiskCount; }
    public void setLowRiskCount(int lowRiskCount) { this.lowRiskCount = lowRiskCount; }
    public int getTotalCounselingRequests() { return totalCounselingRequests; }
    public void setTotalCounselingRequests(int totalCounselingRequests) { this.totalCounselingRequests = totalCounselingRequests; }
    public int getCompletedSessions() { return completedSessions; }
    public void setCompletedSessions(int completedSessions) { this.completedSessions = completedSessions; }
    public double getAssessmentParticipationRate() { return assessmentParticipationRate; }
    public void setAssessmentParticipationRate(double assessmentParticipationRate) { this.assessmentParticipationRate = assessmentParticipationRate; }
    public Map<String, Double> getCategoryAverages() { return categoryAverages; }
    public void setCategoryAverages(Map<String, Double> categoryAverages) { this.categoryAverages = categoryAverages; }
}
