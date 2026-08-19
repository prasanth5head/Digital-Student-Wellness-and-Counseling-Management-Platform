package com.wellness.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CounselorDTO {
    private String id;
    private String userId;
    private String name;
    private String email;
    private String avatar;
    private String specialization;
    private String qualifications;
    private int experienceYears;
    private List<String> availableDays;
    private List<String> availableSlots;
    private String officeLocation;
    private String contactNumber;
    private String bio;
    private boolean active;
    private int activeStudentCount;
    private int totalSessionsConducted;
    private double rating;
    private LocalDateTime createdAt;

    public CounselorDTO() {}

    public CounselorDTO(String id, String userId, String name, String email, String avatar, String specialization,
                        String qualifications, int experienceYears, List<String> availableDays,
                        List<String> availableSlots, String officeLocation, String contactNumber, String bio,
                        boolean active, int activeStudentCount, int totalSessionsConducted, double rating,
                        LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.avatar = avatar;
        this.specialization = specialization;
        this.qualifications = qualifications;
        this.experienceYears = experienceYears;
        this.availableDays = availableDays;
        this.availableSlots = availableSlots;
        this.officeLocation = officeLocation;
        this.contactNumber = contactNumber;
        this.bio = bio;
        this.active = active;
        this.activeStudentCount = activeStudentCount;
        this.totalSessionsConducted = totalSessionsConducted;
        this.rating = rating;
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
        private String specialization;
        private String qualifications;
        private int experienceYears;
        private List<String> availableDays;
        private List<String> availableSlots;
        private String officeLocation;
        private String contactNumber;
        private String bio;
        private boolean active;
        private int activeStudentCount;
        private int totalSessionsConducted;
        private double rating;
        private LocalDateTime createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder userId(String userId) { this.userId = userId; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder avatar(String avatar) { this.avatar = avatar; return this; }
        public Builder specialization(String specialization) { this.specialization = specialization; return this; }
        public Builder qualifications(String qualifications) { this.qualifications = qualifications; return this; }
        public Builder experienceYears(int experienceYears) { this.experienceYears = experienceYears; return this; }
        public Builder availableDays(List<String> availableDays) { this.availableDays = availableDays; return this; }
        public Builder availableSlots(List<String> availableSlots) { this.availableSlots = availableSlots; return this; }
        public Builder officeLocation(String officeLocation) { this.officeLocation = officeLocation; return this; }
        public Builder contactNumber(String contactNumber) { this.contactNumber = contactNumber; return this; }
        public Builder bio(String bio) { this.bio = bio; return this; }
        public Builder active(boolean active) { this.active = active; return this; }
        public Builder activeStudentCount(int activeStudentCount) { this.activeStudentCount = activeStudentCount; return this; }
        public Builder totalSessionsConducted(int totalSessionsConducted) { this.totalSessionsConducted = totalSessionsConducted; return this; }
        public Builder rating(double rating) { this.rating = rating; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public CounselorDTO build() {
            return new CounselorDTO(id, userId, name, email, avatar, specialization, qualifications, experienceYears,
                    availableDays, availableSlots, officeLocation, contactNumber, bio, active, activeStudentCount,
                    totalSessionsConducted, rating, createdAt);
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
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public String getQualifications() { return qualifications; }
    public void setQualifications(String qualifications) { this.qualifications = qualifications; }
    public int getExperienceYears() { return experienceYears; }
    public void setExperienceYears(int experienceYears) { this.experienceYears = experienceYears; }
    public List<String> getAvailableDays() { return availableDays; }
    public void setAvailableDays(List<String> availableDays) { this.availableDays = availableDays; }
    public List<String> getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(List<String> availableSlots) { this.availableSlots = availableSlots; }
    public String getOfficeLocation() { return officeLocation; }
    public void setOfficeLocation(String officeLocation) { this.officeLocation = officeLocation; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public int getActiveStudentCount() { return activeStudentCount; }
    public void setActiveStudentCount(int activeStudentCount) { this.activeStudentCount = activeStudentCount; }
    public int getTotalSessionsConducted() { return totalSessionsConducted; }
    public void setTotalSessionsConducted(int totalSessionsConducted) { this.totalSessionsConducted = totalSessionsConducted; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
