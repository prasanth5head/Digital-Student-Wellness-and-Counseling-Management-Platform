package com.wellness.dto;

import com.wellness.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    private String registerNumber;
    private String departmentId;
    private String departmentName;
    private int yearOfStudy;
    private String emergencyContact;

    private String specialization;
    private String qualifications;
    private int experienceYears;
    private List<String> availableDays;
    private List<String> availableSlots;
    private String officeLocation;

    private String contactNumber;
    private String bio;

    public RegisterRequest() {}

    public RegisterRequest(String name, String email, String password, Role role, String registerNumber,
                           String departmentId, String departmentName, int yearOfStudy, String emergencyContact,
                           String specialization, String qualifications, int experienceYears,
                           List<String> availableDays, List<String> availableSlots, String officeLocation,
                           String contactNumber, String bio) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.registerNumber = registerNumber;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.yearOfStudy = yearOfStudy;
        this.emergencyContact = emergencyContact;
        this.specialization = specialization;
        this.qualifications = qualifications;
        this.experienceYears = experienceYears;
        this.availableDays = availableDays;
        this.availableSlots = availableSlots;
        this.officeLocation = officeLocation;
        this.contactNumber = contactNumber;
        this.bio = bio;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public int getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(int yearOfStudy) { this.yearOfStudy = yearOfStudy; }
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
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
}
