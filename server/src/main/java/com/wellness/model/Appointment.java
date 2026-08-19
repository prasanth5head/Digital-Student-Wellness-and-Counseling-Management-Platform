package com.wellness.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "appointments")
public class Appointment {
    @Id
    private String id;

    @Indexed
    private String studentId;

    private String studentName;
    private String studentRegisterNo;
    private String studentEmail;
    private String studentDepartment;

    @Indexed
    private String counselorId;

    private String counselorName;
    private String counselorEmail;
    private String requestId;

    @Indexed
    private LocalDate appointmentDate;

    private String startTime;
    private String endTime;
    private AppointmentMode mode = AppointmentMode.ONLINE;
    private String meetingLink;
    private String location;
    private AppointmentStatus status = AppointmentStatus.UPCOMING;
    private String purpose;
    private String notes;
    private String cancellationReason;
    private String sessionId;
    private boolean reminderSent = false;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    public Appointment() {}

    public Appointment(String id, String studentId, String studentName, String studentRegisterNo,
                       String studentEmail, String studentDepartment, String counselorId,
                       String counselorName, String counselorEmail, String requestId,
                       LocalDate appointmentDate, String startTime, String endTime,
                       AppointmentMode mode, String meetingLink, String location,
                       AppointmentStatus status, String purpose, String notes,
                       String cancellationReason, String sessionId, boolean reminderSent,
                       LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentRegisterNo = studentRegisterNo;
        this.studentEmail = studentEmail;
        this.studentDepartment = studentDepartment;
        this.counselorId = counselorId;
        this.counselorName = counselorName;
        this.counselorEmail = counselorEmail;
        this.requestId = requestId;
        this.appointmentDate = appointmentDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.mode = mode != null ? mode : AppointmentMode.ONLINE;
        this.meetingLink = meetingLink;
        this.location = location;
        this.status = status != null ? status : AppointmentStatus.UPCOMING;
        this.purpose = purpose;
        this.notes = notes;
        this.cancellationReason = cancellationReason;
        this.sessionId = sessionId;
        this.reminderSent = reminderSent;
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
        private String studentDepartment;
        private String counselorId;
        private String counselorName;
        private String counselorEmail;
        private String requestId;
        private LocalDate appointmentDate;
        private String startTime;
        private String endTime;
        private AppointmentMode mode = AppointmentMode.ONLINE;
        private String meetingLink;
        private String location;
        private AppointmentStatus status = AppointmentStatus.UPCOMING;
        private String purpose;
        private String notes;
        private String cancellationReason;
        private String sessionId;
        private boolean reminderSent = false;
        private LocalDateTime createdAt = LocalDateTime.now();
        private LocalDateTime updatedAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder studentId(String studentId) { this.studentId = studentId; return this; }
        public Builder studentName(String studentName) { this.studentName = studentName; return this; }
        public Builder studentRegisterNo(String studentRegisterNo) { this.studentRegisterNo = studentRegisterNo; return this; }
        public Builder studentEmail(String studentEmail) { this.studentEmail = studentEmail; return this; }
        public Builder studentDepartment(String studentDepartment) { this.studentDepartment = studentDepartment; return this; }
        public Builder counselorId(String counselorId) { this.counselorId = counselorId; return this; }
        public Builder counselorName(String counselorName) { this.counselorName = counselorName; return this; }
        public Builder counselorEmail(String counselorEmail) { this.counselorEmail = counselorEmail; return this; }
        public Builder requestId(String requestId) { this.requestId = requestId; return this; }
        public Builder appointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; return this; }
        public Builder startTime(String startTime) { this.startTime = startTime; return this; }
        public Builder endTime(String endTime) { this.endTime = endTime; return this; }
        public Builder mode(AppointmentMode mode) { this.mode = mode; return this; }
        public Builder meetingLink(String meetingLink) { this.meetingLink = meetingLink; return this; }
        public Builder location(String location) { this.location = location; return this; }
        public Builder status(AppointmentStatus status) { this.status = status; return this; }
        public Builder purpose(String purpose) { this.purpose = purpose; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder cancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; return this; }
        public Builder sessionId(String sessionId) { this.sessionId = sessionId; return this; }
        public Builder reminderSent(boolean reminderSent) { this.reminderSent = reminderSent; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Appointment build() {
            return new Appointment(id, studentId, studentName, studentRegisterNo, studentEmail, studentDepartment,
                    counselorId, counselorName, counselorEmail, requestId, appointmentDate, startTime, endTime,
                    mode, meetingLink, location, status, purpose, notes, cancellationReason, sessionId, reminderSent, createdAt, updatedAt);
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
    public String getStudentDepartment() { return studentDepartment; }
    public void setStudentDepartment(String studentDepartment) { this.studentDepartment = studentDepartment; }
    public String getCounselorId() { return counselorId; }
    public void setCounselorId(String counselorId) { this.counselorId = counselorId; }
    public String getCounselorName() { return counselorName; }
    public void setCounselorName(String counselorName) { this.counselorName = counselorName; }
    public String getCounselorEmail() { return counselorEmail; }
    public void setCounselorEmail(String counselorEmail) { this.counselorEmail = counselorEmail; }
    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }
    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
    public AppointmentMode getMode() { return mode; }
    public void setMode(AppointmentMode mode) { this.mode = mode; }
    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public boolean isReminderSent() { return reminderSent; }
    public void setReminderSent(boolean reminderSent) { this.reminderSent = reminderSent; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
