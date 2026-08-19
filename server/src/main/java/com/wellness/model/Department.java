package com.wellness.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "departments")
public class Department {
    @Id
    private String id;

    @Indexed(unique = true)
    private String code;

    private String name;
    private String headOfDepartment;
    private String description;
    private int studentCount = 0;
    private double averageWellnessScore = 75.0;
    private int highRiskCount = 0;
    private int activeCounselingRequests = 0;
    private int completedSessions = 0;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Department() {}

    public Department(String id, String code, String name, String headOfDepartment, String description,
                      int studentCount, double averageWellnessScore, int highRiskCount,
                      int activeCounselingRequests, int completedSessions, LocalDateTime createdAt) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.headOfDepartment = headOfDepartment;
        this.description = description;
        this.studentCount = studentCount;
        this.averageWellnessScore = averageWellnessScore;
        this.highRiskCount = highRiskCount;
        this.activeCounselingRequests = activeCounselingRequests;
        this.completedSessions = completedSessions;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String code;
        private String name;
        private String headOfDepartment;
        private String description;
        private int studentCount = 0;
        private double averageWellnessScore = 75.0;
        private int highRiskCount = 0;
        private int activeCounselingRequests = 0;
        private int completedSessions = 0;
        private LocalDateTime createdAt = LocalDateTime.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder code(String code) { this.code = code; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder headOfDepartment(String headOfDepartment) { this.headOfDepartment = headOfDepartment; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder studentCount(int studentCount) { this.studentCount = studentCount; return this; }
        public Builder averageWellnessScore(double averageWellnessScore) { this.averageWellnessScore = averageWellnessScore; return this; }
        public Builder highRiskCount(int highRiskCount) { this.highRiskCount = highRiskCount; return this; }
        public Builder activeCounselingRequests(int activeCounselingRequests) { this.activeCounselingRequests = activeCounselingRequests; return this; }
        public Builder completedSessions(int completedSessions) { this.completedSessions = completedSessions; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Department build() {
            return new Department(id, code, name, headOfDepartment, description, studentCount,
                    averageWellnessScore, highRiskCount, activeCounselingRequests, completedSessions, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getHeadOfDepartment() { return headOfDepartment; }
    public void setHeadOfDepartment(String headOfDepartment) { this.headOfDepartment = headOfDepartment; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getStudentCount() { return studentCount; }
    public void setStudentCount(int studentCount) { this.studentCount = studentCount; }
    public double getAverageWellnessScore() { return averageWellnessScore; }
    public void setAverageWellnessScore(double averageWellnessScore) { this.averageWellnessScore = averageWellnessScore; }
    public int getHighRiskCount() { return highRiskCount; }
    public void setHighRiskCount(int highRiskCount) { this.highRiskCount = highRiskCount; }
    public int getActiveCounselingRequests() { return activeCounselingRequests; }
    public void setActiveCounselingRequests(int activeCounselingRequests) { this.activeCounselingRequests = activeCounselingRequests; }
    public int getCompletedSessions() { return completedSessions; }
    public void setCompletedSessions(int completedSessions) { this.completedSessions = completedSessions; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
