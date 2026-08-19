package com.wellness.dto;

import com.wellness.model.UrgencyLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class CounselingRequestCreateDTO {
    private String preferredCounselorId;

    @NotBlank(message = "Request type is required")
    private String requestType;

    private LocalDate preferredDate;
    private String preferredTimeSlot;

    @NotBlank(message = "Reason for counseling is required")
    private String reason;

    @NotNull(message = "Urgency level is required")
    private UrgencyLevel urgency;

    private String additionalNotes;

    public CounselingRequestCreateDTO() {}

    public CounselingRequestCreateDTO(String preferredCounselorId, String requestType, LocalDate preferredDate,
                                      String preferredTimeSlot, String reason, UrgencyLevel urgency, String additionalNotes) {
        this.preferredCounselorId = preferredCounselorId;
        this.requestType = requestType;
        this.preferredDate = preferredDate;
        this.preferredTimeSlot = preferredTimeSlot;
        this.reason = reason;
        this.urgency = urgency;
        this.additionalNotes = additionalNotes;
    }

    public String getPreferredCounselorId() { return preferredCounselorId; }
    public void setPreferredCounselorId(String preferredCounselorId) { this.preferredCounselorId = preferredCounselorId; }
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
}
