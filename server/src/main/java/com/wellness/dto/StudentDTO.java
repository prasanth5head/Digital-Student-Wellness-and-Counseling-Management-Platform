package com.wellness.dto;

import com.wellness.model.RiskLevel;

import java.time.LocalDateTime;

public class StudentDTO {
    private String id;
    private String userId;
    private String name;
    private String email;
    private String avatar;
    private String registerNumber;
    private String departmentId;
    private String departmentName;
    private int yearOfStudy;
    private int currentWellnessScore;
    private int stressScore;
    private int anxietyScore;
    private int sleepScore;
    private RiskLevel riskLevel;
    private String assignedCounselorId;
    private String assignedCounselorName;
    private String contactNumber;
    private String emergencyContact;
    private String bio;
    private LocalDateTime lastAssessmentDate;
    private LocalDateTime createdAt;

    public StudentDTO() {}

    public StudentDTO(String id, String userId, String name, String email, String avatar, String registerNumber,
                      String departmentId, String departmentName, int yearOfStudy, int currentWellnessScore,
                      int stressScore, int anxietyScore, int sleepScore, RiskLevel riskLevel,
                      String assignedCounselorId, String assignedCounselorName, String contactNumber,
                      String emergencyContact, String bio, LocalDateTime lastAssessmentDate, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.avatar = avatar;
        this.registerNumber = registerNumber;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.yearOfStudy = yearOfStudy;
        this.currentWellnessScore = currentWellnessScore;
        this.stressScore = stressScore;
        this.anxietyScore = anxietyScore;
        this.sleepScore = sleepScore;
        this.riskLevel = riskLevel;
        this.assignedCounselorId = assignedCounselorId;
        this.assignedCounselorName = assignedCounselorName;
        this.contactNumber = contactNumber;
        this.emergencyContact = emergencyContact;
        this.bio = bio;
        this.lastAssessmentDate = lastAssessmentDate;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String userId;
        private String name;
        private String email;
        private String avatar;
        private String registerNumber;
        private String departmentId;
        private String departmentName;
        private int yearOfStudy;
        private int currentWellnessScore;
        private int stressScore;
        private int anxietyScore;
        private int sleepScore;
        private RiskLevel riskLevel;
        private String assignedCounselorId;
        private String assignedCounselorName;
        private String contactNumber;
        private String emergencyContact;
        private String bio;
        private LocalDateTime lastAssessmentDate;
        private LocalDateTime createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder userId(String userId) { this.userId = userId; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder avatar(String avatar) { this.avatar = avatar; return this; }
        public Builder registerNumber(String registerNumber) { this.registerNumber = registerNumber; return this; }
        public Builder departmentId(String departmentId) { this.departmentId = departmentId; return this; }
        public Builder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public Builder yearOfStudy(int yearOfStudy) { this.yearOfStudy = yearOfStudy; return this; }
        public Builder currentWellnessScore(int currentWellnessScore) { this.currentWellnessScore = currentWellnessScore; return this; }
        public Builder stressScore(int stressScore) { this.stressScore = stressScore; return this; }
        public Builder anxietyScore(int anxietyScore) { this.anxietyScore = anxietyScore; return this; }
        public Builder sleepScore(int sleepScore) { this.sleepScore = sleepScore; return this; }
        public Builder riskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; return this; }
        public Builder assignedCounselorId(String assignedCounselorId) { this.assignedCounselorId = assignedCounselorId; return this; }
        public Builder assignedCounselorName(String assignedCounselorName) { this.assignedCounselorName = assignedCounselorName; return this; }
        public Builder contactNumber(String contactNumber) { this.contactNumber = contactNumber; return this; }
        public Builder emergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; return this; }
        public Builder bio(String bio) { this.bio = bio; return this; }
        public Builder lastAssessmentDate(LocalDateTime lastAssessmentDate) { this.lastAssessmentDate = lastAssessmentDate; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public StudentDTO build() {
            return new StudentDTO(id, userId, name, email, avatar, registerNumber, departmentId, departmentName,
                    yearOfStudy, currentWellnessScore, stressScore, anxietyScore, sleepScore, riskLevel,
                    assignedCounselorId, assignedCounselorName, contactNumber, emergencyContact, bio, lastAssessmentDate, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public int getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(int yearOfStudy) { this.yearOfStudy = yearOfStudy; }
    public int getCurrentWellnessScore() { return currentWellnessScore; }
    public void setCurrentWellnessScore(int currentWellnessScore) { this.currentWellnessScore = currentWellnessScore; }
    public int getStressScore() { return stressScore; }
    public void setStressScore(int stressScore) { this.stressScore = stressScore; }
    public int getAnxietyScore() { return anxietyScore; }
    public void setAnxietyScore(int anxietyScore) { this.anxietyScore = anxietyScore; }
    public int getSleepScore() { return sleepScore; }
    public void setSleepScore(int sleepScore) { this.sleepScore = sleepScore; }
    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }
    public String getAssignedCounselorId() { return assignedCounselorId; }
    public void setAssignedCounselorId(String assignedCounselorId) { this.assignedCounselorId = assignedCounselorId; }
    public String getAssignedCounselorName() { return assignedCounselorName; }
    public void setAssignedCounselorName(String assignedCounselorName) { this.assignedCounselorName = assignedCounselorName; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public LocalDateTime getLastAssessmentDate() { return lastAssessmentDate; }
    public void setLastAssessmentDate(LocalDateTime lastAssessmentDate) { this.lastAssessmentDate = lastAssessmentDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
