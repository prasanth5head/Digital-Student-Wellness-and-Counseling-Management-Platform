package com.wellness.dto;

import com.wellness.model.Role;
import jakarta.validation.constraints.NotBlank;

public class GoogleAuthRequest {

    @NotBlank(message = "Google token is required")
    private String credential;

    private Role role; // Optional: used when registering new account via Google
    private String departmentId;
    private String departmentName;
    private String registerNumber;
    private Integer yearOfStudy;
    private String emergencyContact;
    private String specialization;
    private String qualifications;

    public GoogleAuthRequest() {}

    public GoogleAuthRequest(String credential, Role role, String departmentId, String departmentName,
                             String registerNumber, Integer yearOfStudy, String emergencyContact,
                             String specialization, String qualifications) {
        this.credential = credential;
        this.role = role;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.registerNumber = registerNumber;
        this.yearOfStudy = yearOfStudy;
        this.emergencyContact = emergencyContact;
        this.specialization = specialization;
        this.qualifications = qualifications;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String credential;
        private Role role;
        private String departmentId;
        private String departmentName;
        private String registerNumber;
        private Integer yearOfStudy;
        private String emergencyContact;
        private String specialization;
        private String qualifications;

        public Builder credential(String credential) { this.credential = credential; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder departmentId(String departmentId) { this.departmentId = departmentId; return this; }
        public Builder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public Builder registerNumber(String registerNumber) { this.registerNumber = registerNumber; return this; }
        public Builder yearOfStudy(Integer yearOfStudy) { this.yearOfStudy = yearOfStudy; return this; }
        public Builder emergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; return this; }
        public Builder specialization(String specialization) { this.specialization = specialization; return this; }
        public Builder qualifications(String qualifications) { this.qualifications = qualifications; return this; }

        public GoogleAuthRequest build() {
            return new GoogleAuthRequest(credential, role, departmentId, departmentName, registerNumber, yearOfStudy, emergencyContact, specialization, qualifications);
        }
    }

    public String getCredential() { return credential; }
    public void setCredential(String credential) { this.credential = credential; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public Integer getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(Integer yearOfStudy) { this.yearOfStudy = yearOfStudy; }
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public String getQualifications() { return qualifications; }
    public void setQualifications(String qualifications) { this.qualifications = qualifications; }
}
