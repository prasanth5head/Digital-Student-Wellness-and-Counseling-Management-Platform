package com.wellness.dto;

import com.wellness.model.RiskLevel;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class CounselorNoteDTO {
    private String id;

    @NotBlank(message = "Student ID is required")
    private String studentId;

    private String studentName;
    private String counselorId;
    private String counselorName;
    private String sessionId;

    @NotBlank(message = "Note title is required")
    private String title;

    @NotBlank(message = "Private clinical notes are required")
    private String privateNotes;

    private RiskLevel clinicalRiskRating;
    private String mentalStatusObservations;
    private String interventionPlan;
    private boolean isConfidential;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CounselorNoteDTO() {}

    public CounselorNoteDTO(String id, String studentId, String studentName, String counselorId,
                            String counselorName, String sessionId, String title, String privateNotes,
                            RiskLevel clinicalRiskRating, String mentalStatusObservations,
                            String interventionPlan, boolean isConfidential, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.counselorId = counselorId;
        this.counselorName = counselorName;
        this.sessionId = sessionId;
        this.title = title;
        this.privateNotes = privateNotes;
        this.clinicalRiskRating = clinicalRiskRating;
        this.mentalStatusObservations = mentalStatusObservations;
        this.interventionPlan = interventionPlan;
        this.isConfidential = isConfidential;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String studentId;
        private String studentName;
        private String counselorId;
        private String counselorName;
        private String sessionId;
        private String title;
        private String privateNotes;
        private RiskLevel clinicalRiskRating;
        private String mentalStatusObservations;
        private String interventionPlan;
        private boolean isConfidential;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder studentId(String studentId) { this.studentId = studentId; return this; }
        public Builder studentName(String studentName) { this.studentName = studentName; return this; }
        public Builder counselorId(String counselorId) { this.counselorId = counselorId; return this; }
        public Builder counselorName(String counselorName) { this.counselorName = counselorName; return this; }
        public Builder sessionId(String sessionId) { this.sessionId = sessionId; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder privateNotes(String privateNotes) { this.privateNotes = privateNotes; return this; }
        public Builder clinicalRiskRating(RiskLevel clinicalRiskRating) { this.clinicalRiskRating = clinicalRiskRating; return this; }
        public Builder mentalStatusObservations(String mentalStatusObservations) { this.mentalStatusObservations = mentalStatusObservations; return this; }
        public Builder interventionPlan(String interventionPlan) { this.interventionPlan = interventionPlan; return this; }
        public Builder isConfidential(boolean isConfidential) { this.isConfidential = isConfidential; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public CounselorNoteDTO build() {
            return new CounselorNoteDTO(id, studentId, studentName, counselorId, counselorName, sessionId, title, privateNotes, clinicalRiskRating, mentalStatusObservations, interventionPlan, isConfidential, createdAt, updatedAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getCounselorId() { return counselorId; }
    public void setCounselorId(String counselorId) { this.counselorId = counselorId; }
    public String getCounselorName() { return counselorName; }
    public void setCounselorName(String counselorName) { this.counselorName = counselorName; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getPrivateNotes() { return privateNotes; }
    public void setPrivateNotes(String privateNotes) { this.privateNotes = privateNotes; }
    public RiskLevel getClinicalRiskRating() { return clinicalRiskRating; }
    public void setClinicalRiskRating(RiskLevel clinicalRiskRating) { this.clinicalRiskRating = clinicalRiskRating; }
    public String getMentalStatusObservations() { return mentalStatusObservations; }
    public void setMentalStatusObservations(String mentalStatusObservations) { this.mentalStatusObservations = mentalStatusObservations; }
    public String getInterventionPlan() { return interventionPlan; }
    public void setInterventionPlan(String interventionPlan) { this.interventionPlan = interventionPlan; }
    public boolean isConfidential() { return isConfidential; }
    public void setConfidential(boolean confidential) { isConfidential = confidential; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
