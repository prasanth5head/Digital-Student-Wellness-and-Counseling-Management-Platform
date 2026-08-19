package com.wellness.dto;

import com.wellness.model.*;

import java.util.List;
import java.util.Map;

public class StudentDashboardDTO {
    private String studentName;
    private String registerNumber;
    private String departmentName;
    private int yearOfStudy;
    private Integer currentWellnessScore;
    private Integer stressScore;
    private Integer anxietyScore;
    private Integer sleepScore;
    private RiskLevel riskLevel;
    private String wellnessStatus;
    private AssessmentResponse recentAssessment;
    private List<CategoryScore> latestCategoryScores;
    private List<Map<String, Object>> scoreTrend;
    private Appointment nextAppointment;
    private List<Appointment> upcomingAppointments;
    private List<CounselingRequest> pendingRequests;
    private long unreadNotificationCount;
    private List<Notification> recentNotifications;
    private List<WellnessResource> recommendedResources;
    private String dailyTip;

    public StudentDashboardDTO() {}

    public StudentDashboardDTO(String studentName, String registerNumber, String departmentName, int yearOfStudy,
                               Integer currentWellnessScore, Integer stressScore, Integer anxietyScore, Integer sleepScore,
                               RiskLevel riskLevel, String wellnessStatus, AssessmentResponse recentAssessment,
                               List<CategoryScore> latestCategoryScores, List<Map<String, Object>> scoreTrend,
                               Appointment nextAppointment, List<Appointment> upcomingAppointments,
                               List<CounselingRequest> pendingRequests, long unreadNotificationCount,
                               List<Notification> recentNotifications, List<WellnessResource> recommendedResources,
                               String dailyTip) {
        this.studentName = studentName;
        this.registerNumber = registerNumber;
        this.departmentName = departmentName;
        this.yearOfStudy = yearOfStudy;
        this.currentWellnessScore = currentWellnessScore;
        this.stressScore = stressScore;
        this.anxietyScore = anxietyScore;
        this.sleepScore = sleepScore;
        this.riskLevel = riskLevel;
        this.wellnessStatus = wellnessStatus;
        this.recentAssessment = recentAssessment;
        this.latestCategoryScores = latestCategoryScores;
        this.scoreTrend = scoreTrend;
        this.nextAppointment = nextAppointment;
        this.upcomingAppointments = upcomingAppointments;
        this.pendingRequests = pendingRequests;
        this.unreadNotificationCount = unreadNotificationCount;
        this.recentNotifications = recentNotifications;
        this.recommendedResources = recommendedResources;
        this.dailyTip = dailyTip;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String studentName;
        private String registerNumber;
        private String departmentName;
        private int yearOfStudy;
        private Integer currentWellnessScore;
        private Integer stressScore;
        private Integer anxietyScore;
        private Integer sleepScore;
        private RiskLevel riskLevel;
        private String wellnessStatus;
        private AssessmentResponse recentAssessment;
        private List<CategoryScore> latestCategoryScores;
        private List<Map<String, Object>> scoreTrend;
        private Appointment nextAppointment;
        private List<Appointment> upcomingAppointments;
        private List<CounselingRequest> pendingRequests;
        private long unreadNotificationCount;
        private List<Notification> recentNotifications;
        private List<WellnessResource> recommendedResources;
        private String dailyTip;

        public Builder studentName(String studentName) { this.studentName = studentName; return this; }
        public Builder registerNumber(String registerNumber) { this.registerNumber = registerNumber; return this; }
        public Builder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public Builder yearOfStudy(int yearOfStudy) { this.yearOfStudy = yearOfStudy; return this; }
        public Builder currentWellnessScore(Integer currentWellnessScore) { this.currentWellnessScore = currentWellnessScore; return this; }
        public Builder stressScore(Integer stressScore) { this.stressScore = stressScore; return this; }
        public Builder anxietyScore(Integer anxietyScore) { this.anxietyScore = anxietyScore; return this; }
        public Builder sleepScore(Integer sleepScore) { this.sleepScore = sleepScore; return this; }
        public Builder riskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; return this; }
        public Builder wellnessStatus(String wellnessStatus) { this.wellnessStatus = wellnessStatus; return this; }
        public Builder recentAssessment(AssessmentResponse recentAssessment) { this.recentAssessment = recentAssessment; return this; }
        public Builder latestCategoryScores(List<CategoryScore> latestCategoryScores) { this.latestCategoryScores = latestCategoryScores; return this; }
        public Builder scoreTrend(List<Map<String, Object>> scoreTrend) { this.scoreTrend = scoreTrend; return this; }
        public Builder nextAppointment(Appointment nextAppointment) { this.nextAppointment = nextAppointment; return this; }
        public Builder upcomingAppointments(List<Appointment> upcomingAppointments) { this.upcomingAppointments = upcomingAppointments; return this; }
        public Builder pendingRequests(List<CounselingRequest> pendingRequests) { this.pendingRequests = pendingRequests; return this; }
        public Builder unreadNotificationCount(long unreadNotificationCount) { this.unreadNotificationCount = unreadNotificationCount; return this; }
        public Builder recentNotifications(List<Notification> recentNotifications) { this.recentNotifications = recentNotifications; return this; }
        public Builder recommendedResources(List<WellnessResource> recommendedResources) { this.recommendedResources = recommendedResources; return this; }
        public Builder dailyTip(String dailyTip) { this.dailyTip = dailyTip; return this; }

        public StudentDashboardDTO build() {
            return new StudentDashboardDTO(studentName, registerNumber, departmentName, yearOfStudy,
                    currentWellnessScore, stressScore, anxietyScore, sleepScore, riskLevel, wellnessStatus,
                    recentAssessment, latestCategoryScores, scoreTrend, nextAppointment, upcomingAppointments,
                    pendingRequests, unreadNotificationCount, recentNotifications, recommendedResources, dailyTip);
        }
    }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public int getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(int yearOfStudy) { this.yearOfStudy = yearOfStudy; }
    public Integer getCurrentWellnessScore() { return currentWellnessScore; }
    public void setCurrentWellnessScore(Integer currentWellnessScore) { this.currentWellnessScore = currentWellnessScore; }
    public Integer getStressScore() { return stressScore; }
    public void setStressScore(Integer stressScore) { this.stressScore = stressScore; }
    public Integer getAnxietyScore() { return anxietyScore; }
    public void setAnxietyScore(Integer anxietyScore) { this.anxietyScore = anxietyScore; }
    public Integer getSleepScore() { return sleepScore; }
    public void setSleepScore(Integer sleepScore) { this.sleepScore = sleepScore; }
    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }
    public String getWellnessStatus() { return wellnessStatus; }
    public void setWellnessStatus(String wellnessStatus) { this.wellnessStatus = wellnessStatus; }
    public AssessmentResponse getRecentAssessment() { return recentAssessment; }
    public void setRecentAssessment(AssessmentResponse recentAssessment) { this.recentAssessment = recentAssessment; }
    public List<CategoryScore> getLatestCategoryScores() { return latestCategoryScores; }
    public void setLatestCategoryScores(List<CategoryScore> latestCategoryScores) { this.latestCategoryScores = latestCategoryScores; }
    public List<Map<String, Object>> getScoreTrend() { return scoreTrend; }
    public void setScoreTrend(List<Map<String, Object>> scoreTrend) { this.scoreTrend = scoreTrend; }
    public Appointment getNextAppointment() { return nextAppointment; }
    public void setNextAppointment(Appointment nextAppointment) { this.nextAppointment = nextAppointment; }
    public List<Appointment> getUpcomingAppointments() { return upcomingAppointments; }
    public void setUpcomingAppointments(List<Appointment> upcomingAppointments) { this.upcomingAppointments = upcomingAppointments; }
    public List<CounselingRequest> getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(List<CounselingRequest> pendingRequests) { this.pendingRequests = pendingRequests; }
    public long getUnreadNotificationCount() { return unreadNotificationCount; }
    public void setUnreadNotificationCount(long unreadNotificationCount) { this.unreadNotificationCount = unreadNotificationCount; }
    public List<Notification> getRecentNotifications() { return recentNotifications; }
    public void setRecentNotifications(List<Notification> recentNotifications) { this.recentNotifications = recentNotifications; }
    public List<WellnessResource> getRecommendedResources() { return recommendedResources; }
    public void setRecommendedResources(List<WellnessResource> recommendedResources) { this.recommendedResources = recommendedResources; }
    public String getDailyTip() { return dailyTip; }
    public void setDailyTip(String dailyTip) { this.dailyTip = dailyTip; }
}
