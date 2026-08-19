package com.wellness.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "counselorNotes")
public class CounselorNote {
    @Id
    private String id;

    @Indexed
    private String studentId;

    @Indexed
    private String counselorId;
    private String counselorName;
    private String sessionId;
    private String title;
    private String privateNotes;
    private RiskLevel clinicalRiskRating = RiskLevel.LOW;
    private String mentalStatusObservations;
    private String interventionPlan;
    private boolean isConfidential = true;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    public CounselorNote() {}

    public CounselorNote(String id, String studentId, String counselorId, String counselorName,
                         String sessionId, String title, String privateNotes, RiskLevel clinicalRiskRating,
                         String mentalStatusObservations, String interventionPlan, boolean isConfidential,
                         LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.studentId = studentId;
        this.counselorId = counselorId;
        this.counselorName = counselorName;
        this.sessionId = sessionId;
        this.title = title;
        this.privateNotes = privateNotes;
        this.clinicalRiskRating = clinicalRiskRating != null ? clinicalRiskRating : RiskLevel.LOW;
        this.mentalStatusObservations = mentalStatusObservations;
        this.interventionPlan = interventionPlan;
        this.isConfidential = isConfidential;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String studentId;
        private String counselorId;
        private String counselorName;
        private String sessionId;
        private String title;
        private String privateNotes;
        private RiskLevel clinicalRiskRating = RiskLevel.LOW;
        private String mentalStatusObservations;
        private String interventionPlan;
        private boolean isConfidential = true;
        private LocalDateTime createdAt = LocalDateTime.now();
        private LocalDateTime updatedAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder studentId(String studentId) { this.studentId = studentId; return this; }
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

        public CounselorNote build() {
            return new CounselorNote(id, studentId, counselorId, counselorName, sessionId, title,
                    privateNotes, clinicalRiskRating, mentalStatusObservations, interventionPlan, isConfidential, createdAt, updatedAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
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
