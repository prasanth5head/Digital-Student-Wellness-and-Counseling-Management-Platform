package com.wellness.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "counselingSessions")
public class CounselingSession {
    @Id
    private String id;

    @Indexed
    private String appointmentId;

    @Indexed
    private String studentId;
    private String studentName;
    private String studentRegisterNo;

    @Indexed
    private String counselorId;
    private String counselorName;

    private LocalDate sessionDate;
    private int durationMinutes;
    private String sessionType;
    private String sessionSummary;
    private String keyTakeaways;
    private List<String> studentActionItems = new ArrayList<>();
    private List<String> recommendedResourceIds = new ArrayList<>();
    private LocalDate nextFollowUpDate;
    private LocalDateTime createdAt = LocalDateTime.now();

    public CounselingSession() {}

    public CounselingSession(String id, String appointmentId, String studentId, String studentName,
                             String studentRegisterNo, String counselorId, String counselorName,
                             LocalDate sessionDate, int durationMinutes, String sessionType,
                             String sessionSummary, String keyTakeaways, List<String> studentActionItems,
                             List<String> recommendedResourceIds, LocalDate nextFollowUpDate, LocalDateTime createdAt) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentRegisterNo = studentRegisterNo;
        this.counselorId = counselorId;
        this.counselorName = counselorName;
        this.sessionDate = sessionDate;
        this.durationMinutes = durationMinutes;
        this.sessionType = sessionType;
        this.sessionSummary = sessionSummary;
        this.keyTakeaways = keyTakeaways;
        this.studentActionItems = studentActionItems != null ? studentActionItems : new ArrayList<>();
        this.recommendedResourceIds = recommendedResourceIds != null ? recommendedResourceIds : new ArrayList<>();
        this.nextFollowUpDate = nextFollowUpDate;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String appointmentId;
        private String studentId;
        private String studentName;
        private String studentRegisterNo;
        private String counselorId;
        private String counselorName;
        private LocalDate sessionDate;
        private int durationMinutes;
        private String sessionType;
        private String sessionSummary;
        private String keyTakeaways;
        private List<String> studentActionItems = new ArrayList<>();
        private List<String> recommendedResourceIds = new ArrayList<>();
        private LocalDate nextFollowUpDate;
        private LocalDateTime createdAt = LocalDateTime.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder appointmentId(String appointmentId) { this.appointmentId = appointmentId; return this; }
        public Builder studentId(String studentId) { this.studentId = studentId; return this; }
        public Builder studentName(String studentName) { this.studentName = studentName; return this; }
        public Builder studentRegisterNo(String studentRegisterNo) { this.studentRegisterNo = studentRegisterNo; return this; }
        public Builder counselorId(String counselorId) { this.counselorId = counselorId; return this; }
        public Builder counselorName(String counselorName) { this.counselorName = counselorName; return this; }
        public Builder sessionDate(LocalDate sessionDate) { this.sessionDate = sessionDate; return this; }
        public Builder durationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; return this; }
        public Builder sessionType(String sessionType) { this.sessionType = sessionType; return this; }
        public Builder sessionSummary(String sessionSummary) { this.sessionSummary = sessionSummary; return this; }
        public Builder keyTakeaways(String keyTakeaways) { this.keyTakeaways = keyTakeaways; return this; }
        public Builder studentActionItems(List<String> studentActionItems) { this.studentActionItems = studentActionItems; return this; }
        public Builder recommendedResourceIds(List<String> recommendedResourceIds) { this.recommendedResourceIds = recommendedResourceIds; return this; }
        public Builder nextFollowUpDate(LocalDate nextFollowUpDate) { this.nextFollowUpDate = nextFollowUpDate; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public CounselingSession build() {
            return new CounselingSession(id, appointmentId, studentId, studentName, studentRegisterNo,
                    counselorId, counselorName, sessionDate, durationMinutes, sessionType, sessionSummary,
                    keyTakeaways, studentActionItems, recommendedResourceIds, nextFollowUpDate, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getAppointmentId() { return appointmentId; }
    public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getStudentRegisterNo() { return studentRegisterNo; }
    public void setStudentRegisterNo(String studentRegisterNo) { this.studentRegisterNo = studentRegisterNo; }
    public String getCounselorId() { return counselorId; }
    public void setCounselorId(String counselorId) { this.counselorId = counselorId; }
    public String getCounselorName() { return counselorName; }
    public void setCounselorName(String counselorName) { this.counselorName = counselorName; }
    public LocalDate getSessionDate() { return sessionDate; }
    public void setSessionDate(LocalDate sessionDate) { this.sessionDate = sessionDate; }
    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
    public String getSessionType() { return sessionType; }
    public void setSessionType(String sessionType) { this.sessionType = sessionType; }
    public String getSessionSummary() { return sessionSummary; }
    public void setSessionSummary(String sessionSummary) { this.sessionSummary = sessionSummary; }
    public String getKeyTakeaways() { return keyTakeaways; }
    public void setKeyTakeaways(String keyTakeaways) { this.keyTakeaways = keyTakeaways; }
    public List<String> getStudentActionItems() { return studentActionItems; }
    public void setStudentActionItems(List<String> studentActionItems) { this.studentActionItems = studentActionItems; }
    public List<String> getRecommendedResourceIds() { return recommendedResourceIds; }
    public void setRecommendedResourceIds(List<String> recommendedResourceIds) { this.recommendedResourceIds = recommendedResourceIds; }
    public LocalDate getNextFollowUpDate() { return nextFollowUpDate; }
    public void setNextFollowUpDate(LocalDate nextFollowUpDate) { this.nextFollowUpDate = nextFollowUpDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
