package com.wellness.dto;

import java.util.List;
import java.util.Map;

public class AdminAnalyticsOverviewDTO {
    private long totalStudents;
    private long totalCounselors;
    private long activeUsers;
    private long totalCounselingSessions;
    private long pendingRequests;
    private long upcomingAppointments;
    private long highRiskStudentsCount;
    private double campusAverageWellnessScore;
    private double assessmentCompletionRate;
    private Map<String, Integer> riskLevelDistribution;
    private Map<String, Integer> appointmentStatusDistribution;
    private Map<String, Integer> counselingDemandByType;
    private List<Map<String, Object>> monthlyTrends;
    private List<DepartmentAnalyticsDTO> departmentSummaries;

    public AdminAnalyticsOverviewDTO() {}

    public AdminAnalyticsOverviewDTO(long totalStudents, long totalCounselors, long activeUsers,
                                     long totalCounselingSessions, long pendingRequests,
                                     long upcomingAppointments, long highRiskStudentsCount,
                                     double campusAverageWellnessScore, double assessmentCompletionRate,
                                     Map<String, Integer> riskLevelDistribution,
                                     Map<String, Integer> appointmentStatusDistribution,
                                     Map<String, Integer> counselingDemandByType,
                                     List<Map<String, Object>> monthlyTrends,
                                     List<DepartmentAnalyticsDTO> departmentSummaries) {
        this.totalStudents = totalStudents;
        this.totalCounselors = totalCounselors;
        this.activeUsers = activeUsers;
        this.totalCounselingSessions = totalCounselingSessions;
        this.pendingRequests = pendingRequests;
        this.upcomingAppointments = upcomingAppointments;
        this.highRiskStudentsCount = highRiskStudentsCount;
        this.campusAverageWellnessScore = campusAverageWellnessScore;
        this.assessmentCompletionRate = assessmentCompletionRate;
        this.riskLevelDistribution = riskLevelDistribution;
        this.appointmentStatusDistribution = appointmentStatusDistribution;
        this.counselingDemandByType = counselingDemandByType;
        this.monthlyTrends = monthlyTrends;
        this.departmentSummaries = departmentSummaries;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private long totalStudents;
        private long totalCounselors;
        private long activeUsers;
        private long totalCounselingSessions;
        private long pendingRequests;
        private long upcomingAppointments;
        private long highRiskStudentsCount;
        private double campusAverageWellnessScore;
        private double assessmentCompletionRate;
        private Map<String, Integer> riskLevelDistribution;
        private Map<String, Integer> appointmentStatusDistribution;
        private Map<String, Integer> counselingDemandByType;
        private List<Map<String, Object>> monthlyTrends;
        private List<DepartmentAnalyticsDTO> departmentSummaries;

        public Builder totalStudents(long totalStudents) { this.totalStudents = totalStudents; return this; }
        public Builder totalCounselors(long totalCounselors) { this.totalCounselors = totalCounselors; return this; }
        public Builder activeUsers(long activeUsers) { this.activeUsers = activeUsers; return this; }
        public Builder totalCounselingSessions(long totalCounselingSessions) { this.totalCounselingSessions = totalCounselingSessions; return this; }
        public Builder pendingRequests(long pendingRequests) { this.pendingRequests = pendingRequests; return this; }
        public Builder upcomingAppointments(long upcomingAppointments) { this.upcomingAppointments = upcomingAppointments; return this; }
        public Builder highRiskStudentsCount(long highRiskStudentsCount) { this.highRiskStudentsCount = highRiskStudentsCount; return this; }
        public Builder campusAverageWellnessScore(double campusAverageWellnessScore) { this.campusAverageWellnessScore = campusAverageWellnessScore; return this; }
        public Builder assessmentCompletionRate(double assessmentCompletionRate) { this.assessmentCompletionRate = assessmentCompletionRate; return this; }
        public Builder riskLevelDistribution(Map<String, Integer> riskLevelDistribution) { this.riskLevelDistribution = riskLevelDistribution; return this; }
        public Builder appointmentStatusDistribution(Map<String, Integer> appointmentStatusDistribution) { this.appointmentStatusDistribution = appointmentStatusDistribution; return this; }
        public Builder counselingDemandByType(Map<String, Integer> counselingDemandByType) { this.counselingDemandByType = counselingDemandByType; return this; }
        public Builder monthlyTrends(List<Map<String, Object>> monthlyTrends) { this.monthlyTrends = monthlyTrends; return this; }
        public Builder departmentSummaries(List<DepartmentAnalyticsDTO> departmentSummaries) { this.departmentSummaries = departmentSummaries; return this; }

        public AdminAnalyticsOverviewDTO build() {
            return new AdminAnalyticsOverviewDTO(totalStudents, totalCounselors, activeUsers, totalCounselingSessions,
                    pendingRequests, upcomingAppointments, highRiskStudentsCount, campusAverageWellnessScore,
                    assessmentCompletionRate, riskLevelDistribution, appointmentStatusDistribution,
                    counselingDemandByType, monthlyTrends, departmentSummaries);
        }
    }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }
    public long getTotalCounselors() { return totalCounselors; }
    public void setTotalCounselors(long totalCounselors) { this.totalCounselors = totalCounselors; }
    public long getActiveUsers() { return activeUsers; }
    public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }
    public long getTotalCounselingSessions() { return totalCounselingSessions; }
    public void setTotalCounselingSessions(long totalCounselingSessions) { this.totalCounselingSessions = totalCounselingSessions; }
    public long getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(long pendingRequests) { this.pendingRequests = pendingRequests; }
    public long getUpcomingAppointments() { return upcomingAppointments; }
    public void setUpcomingAppointments(long upcomingAppointments) { this.upcomingAppointments = upcomingAppointments; }
    public long getHighRiskStudentsCount() { return highRiskStudentsCount; }
    public void setHighRiskStudentsCount(long highRiskStudentsCount) { this.highRiskStudentsCount = highRiskStudentsCount; }
    public double getCampusAverageWellnessScore() { return campusAverageWellnessScore; }
    public void setCampusAverageWellnessScore(double campusAverageWellnessScore) { this.campusAverageWellnessScore = campusAverageWellnessScore; }
    public double getAssessmentCompletionRate() { return assessmentCompletionRate; }
    public void setAssessmentCompletionRate(double assessmentCompletionRate) { this.assessmentCompletionRate = assessmentCompletionRate; }
    public Map<String, Integer> getRiskLevelDistribution() { return riskLevelDistribution; }
    public void setRiskLevelDistribution(Map<String, Integer> riskLevelDistribution) { this.riskLevelDistribution = riskLevelDistribution; }
    public Map<String, Integer> getAppointmentStatusDistribution() { return appointmentStatusDistribution; }
    public void setAppointmentStatusDistribution(Map<String, Integer> appointmentStatusDistribution) { this.appointmentStatusDistribution = appointmentStatusDistribution; }
    public Map<String, Integer> getCounselingDemandByType() { return counselingDemandByType; }
    public void setCounselingDemandByType(Map<String, Integer> counselingDemandByType) { this.counselingDemandByType = counselingDemandByType; }
    public List<Map<String, Object>> getMonthlyTrends() { return monthlyTrends; }
    public void setMonthlyTrends(List<Map<String, Object>> monthlyTrends) { this.monthlyTrends = monthlyTrends; }
    public List<DepartmentAnalyticsDTO> getDepartmentSummaries() { return departmentSummaries; }
    public void setDepartmentSummaries(List<DepartmentAnalyticsDTO> departmentSummaries) { this.departmentSummaries = departmentSummaries; }
}
