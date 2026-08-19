package com.wellness.dto;

import com.wellness.model.AppointmentMode;
import com.wellness.model.AppointmentStatus;

import java.time.LocalDate;

public class AppointmentUpdateDTO {
    private LocalDate appointmentDate;
    private String startTime;
    private String endTime;
    private AppointmentMode mode;
    private String meetingLink;
    private String location;
    private AppointmentStatus status;
    private String cancellationReason;
    private String notes;

    public AppointmentUpdateDTO() {}

    public AppointmentUpdateDTO(LocalDate appointmentDate, String startTime, String endTime, AppointmentMode mode,
                                String meetingLink, String location, AppointmentStatus status, String cancellationReason, String notes) {
        this.appointmentDate = appointmentDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.mode = mode;
        this.meetingLink = meetingLink;
        this.location = location;
        this.status = status;
        this.cancellationReason = cancellationReason;
        this.notes = notes;
    }

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
    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
