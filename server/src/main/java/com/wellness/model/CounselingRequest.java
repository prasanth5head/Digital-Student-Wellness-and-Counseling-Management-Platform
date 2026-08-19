package com.wellness.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "counselingRequests")
public class CounselingRequest {
    @Id
    private String id;

    @Indexed
    private String studentId;

    private String studentName;
    private String studentRegisterNo;
    private String studentEmail;
    private String departmentName;
    private String preferredCounselorId;
    private String preferredCounselorName;
    private String requestType;
    private LocalDate preferredDate;
    private String preferredTimeSlot;
    private String reason;
    private UrgencyLevel urgency;
    private String additionalNotes;
    private RequestStatus status = RequestStatus.PENDING;
    private String counselorResponseNotes;
    private String scheduledAppointmentId;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    public CounselingRequest() {}

    public CounselingRequest(String id, String studentId, String studentName, String studentRegisterNo,
                             String studentEmail, String departmentName, String preferredCounselorId,
                             String preferredCounselorName, String requestType, LocalDate preferredDate,
                             String preferredTimeSlot, String reason, UrgencyLevel urgency,
                             String additionalNotes, RequestStatus status, String counselorResponseNotes,
                             String scheduledAppointmentId, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentRegisterNo = studentRegisterNo;
        this.studentEmail = studentEmail;
        this.departmentName = departmentName;
        this.preferredCounselorId = preferredCounselorId;
        this.preferredCounselorName = preferredCounselorName;
        this.requestType = requestType;
        this.preferredDate = preferredDate;
        this.preferredTimeSlot = preferredTimeSlot;
        this.reason = reason;
        this.urgency = urgency;
        this.additionalNotes = additionalNotes;
        this.status = status != null ? status : RequestStatus.PENDING;
        this.counselorResponseNotes = counselorResponseNotes;
        this.scheduledAppointmentId = scheduledAppointmentId;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String studentId;
        private String studentName;
        private String studentRegisterNo;
        private String studentEmail;
        private String departmentName;
        private String preferredCounselorId;
        private String preferredCounselorName;
        private String requestType;
        private LocalDate preferredDate;
        private String preferredTimeSlot;
        private String reason;
        private UrgencyLevel urgency;
        private String additionalNotes;
        private RequestStatus status = RequestStatus.PENDING;
        private String counselorResponseNotes;
        private String scheduledAppointmentId;
        private LocalDateTime createdAt = LocalDateTime.now();
        private LocalDateTime updatedAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder studentId(String studentId) { this.studentId = studentId; return this; }
        public Builder studentName(String studentName) { this.studentName = studentName; return this; }
        public Builder studentRegisterNo(String studentRegisterNo) { this.studentRegisterNo = studentRegisterNo; return this; }
        public Builder studentEmail(String studentEmail) { this.studentEmail = studentEmail; return this; }
        public Builder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public Builder preferredCounselorId(String preferredCounselorId) { this.preferredCounselorId = preferredCounselorId; return this; }
        public Builder preferredCounselorName(String preferredCounselorName) { this.preferredCounselorName = preferredCounselorName; return this; }
        public Builder requestType(String requestType) { this.requestType = requestType; return this; }
        public Builder preferredDate(LocalDate preferredDate) { this.preferredDate = preferredDate; return this; }
        public Builder preferredTimeSlot(String preferredTimeSlot) { this.preferredTimeSlot = preferredTimeSlot; return this; }
        public Builder reason(String reason) { this.reason = reason; return this; }
        public Builder urgency(UrgencyLevel urgency) { this.urgency = urgency; return this; }
        public Builder additionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; return this; }
        public Builder status(RequestStatus status) { this.status = status; return this; }
        public Builder counselorResponseNotes(String counselorResponseNotes) { this.counselorResponseNotes = counselorResponseNotes; return this; }
        public Builder scheduledAppointmentId(String scheduledAppointmentId) { this.scheduledAppointmentId = scheduledAppointmentId; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public CounselingRequest build() {
            return new CounselingRequest(id, studentId, studentName, studentRegisterNo, studentEmail, departmentName,
                    preferredCounselorId, preferredCounselorName, requestType, preferredDate, preferredTimeSlot,
                    reason, urgency, additionalNotes, status, counselorResponseNotes, scheduledAppointmentId, createdAt, updatedAt);
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
    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public String getPreferredCounselorId() { return preferredCounselorId; }
    public void setPreferredCounselorId(String preferredCounselorId) { this.preferredCounselorId = preferredCounselorId; }
    public String getPreferredCounselorName() { return preferredCounselorName; }
    public void setPreferredCounselorName(String preferredCounselorName) { this.preferredCounselorName = preferredCounselorName; }
    public String getRequestType() { return requestType; }
    public void setRequestType(String requestType) { this.requestType = requestType; }
    public LocalDate getPreferredDate() { return preferredDate; }
    public void setPreferredDate(LocalDate preferredDate) { this.preferredDate = preferredDate; }
    public String getPreferredTimeSlot() { return preferredTimeSlot; }
    public void setPreferredTimeSlot(String preferredTimeSlot) { this.preferredTimeSlot = preferredTimeSlot; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public UrgencyLevel getUrgency() { return urgency; }
    public void setUrgency(UrgencyLevel urgency) { this.urgency = urgency; }
    public String getAdditionalNotes() { return additionalNotes; }
    public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }
    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }
    public String getCounselorResponseNotes() { return counselorResponseNotes; }
    public void setCounselorResponseNotes(String counselorResponseNotes) { this.counselorResponseNotes = counselorResponseNotes; }
    public String getScheduledAppointmentId() { return scheduledAppointmentId; }
    public void setScheduledAppointmentId(String scheduledAppointmentId) { this.scheduledAppointmentId = scheduledAppointmentId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
