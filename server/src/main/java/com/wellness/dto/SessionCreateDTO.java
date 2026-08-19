package com.wellness.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class SessionCreateDTO {
    private String appointmentId;

    @NotBlank(message = "Student ID is required")
    private String studentId;

    @NotNull(message = "Session date is required")
    private LocalDate sessionDate;

    @Min(value = 5, message = "Duration must be at least 5 minutes")
    private int durationMinutes;

    @NotBlank(message = "Session type is required")
    private String sessionType;

    @NotBlank(message = "Session summary is required")
    private String sessionSummary;

    private String keyTakeaways;
    private List<String> studentActionItems;
    private List<String> recommendedResourceIds;
    private LocalDate nextFollowUpDate;

    private String privateNotes;
    private String clinicalRiskRating;
    private String mentalStatusObservations;
    private String interventionPlan;

    public SessionCreateDTO() {}

    public SessionCreateDTO(String appointmentId, String studentId, LocalDate sessionDate, int durationMinutes,
                            String sessionType, String sessionSummary, String keyTakeaways, List<String> studentActionItems,
                            List<String> recommendedResourceIds, LocalDate nextFollowUpDate, String privateNotes,
                            String clinicalRiskRating, String mentalStatusObservations, String interventionPlan) {
        this.appointmentId = appointmentId;
        this.studentId = studentId;
        this.sessionDate = sessionDate;
        this.durationMinutes = durationMinutes;
        this.sessionType = sessionType;
        this.sessionSummary = sessionSummary;
        this.keyTakeaways = keyTakeaways;
        this.studentActionItems = studentActionItems;
        this.recommendedResourceIds = recommendedResourceIds;
        this.nextFollowUpDate = nextFollowUpDate;
        this.privateNotes = privateNotes;
        this.clinicalRiskRating = clinicalRiskRating;
        this.mentalStatusObservations = mentalStatusObservations;
        this.interventionPlan = interventionPlan;
    }

    public String getAppointmentId() { return appointmentId; }
    public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
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
    public String getPrivateNotes() { return privateNotes; }
    public void setPrivateNotes(String privateNotes) { this.privateNotes = privateNotes; }
    public String getClinicalRiskRating() { return clinicalRiskRating; }
    public void setClinicalRiskRating(String clinicalRiskRating) { this.clinicalRiskRating = clinicalRiskRating; }
    public String getMentalStatusObservations() { return mentalStatusObservations; }
    public void setMentalStatusObservations(String mentalStatusObservations) { this.mentalStatusObservations = mentalStatusObservations; }
    public String getInterventionPlan() { return interventionPlan; }
    public void setInterventionPlan(String interventionPlan) { this.interventionPlan = interventionPlan; }
}
