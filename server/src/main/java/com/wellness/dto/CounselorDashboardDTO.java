package com.wellness.dto;

import com.wellness.model.Appointment;
import com.wellness.model.CounselingRequest;
import com.wellness.model.Student;

import java.util.List;
import java.util.Map;

public class CounselorDashboardDTO {
    private String counselorName;
    private String specialization;
    private int totalAssignedStudents;
    private int pendingRequestsCount;
    private int todayAppointmentsCount;
    private int upcomingAppointmentsCount;
    private int highRiskStudentsCount;
    private int completedSessionsCount;
    private long unreadMessagesCount;

    private List<Appointment> todayAppointments;
    private List<CounselingRequest> pendingRequests;
    private List<Student> highRiskStudents;
    private List<Student> assignedStudents;

    private Map<String, Integer> riskLevelDistribution;
    private Map<String, Integer> monthlySessionsChart;
    private Map<String, Integer> appointmentStatusDistribution;

    public CounselorDashboardDTO() {}

    public CounselorDashboardDTO(String counselorName, String specialization, int totalAssignedStudents,
                                 int pendingRequestsCount, int todayAppointmentsCount, int upcomingAppointmentsCount,
                                 int highRiskStudentsCount, int completedSessionsCount, long unreadMessagesCount,
                                 List<Appointment> todayAppointments, List<CounselingRequest> pendingRequests,
                                 List<Student> highRiskStudents, List<Student> assignedStudents,
                                 Map<String, Integer> riskLevelDistribution, Map<String, Integer> monthlySessionsChart,
                                 Map<String, Integer> appointmentStatusDistribution) {
        this.counselorName = counselorName;
        this.specialization = specialization;
        this.totalAssignedStudents = totalAssignedStudents;
        this.pendingRequestsCount = pendingRequestsCount;
        this.todayAppointmentsCount = todayAppointmentsCount;
        this.upcomingAppointmentsCount = upcomingAppointmentsCount;
        this.highRiskStudentsCount = highRiskStudentsCount;
        this.completedSessionsCount = completedSessionsCount;
        this.unreadMessagesCount = unreadMessagesCount;
        this.todayAppointments = todayAppointments;
        this.pendingRequests = pendingRequests;
        this.highRiskStudents = highRiskStudents;
        this.assignedStudents = assignedStudents;
        this.riskLevelDistribution = riskLevelDistribution;
        this.monthlySessionsChart = monthlySessionsChart;
        this.appointmentStatusDistribution = appointmentStatusDistribution;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String counselorName;
        private String specialization;
        private int totalAssignedStudents;
        private int pendingRequestsCount;
        private int todayAppointmentsCount;
        private int upcomingAppointmentsCount;
        private int highRiskStudentsCount;
        private int completedSessionsCount;
        private long unreadMessagesCount;
        private List<Appointment> todayAppointments;
        private List<CounselingRequest> pendingRequests;
        private List<Student> highRiskStudents;
        private List<Student> assignedStudents;
        private Map<String, Integer> riskLevelDistribution;
        private Map<String, Integer> monthlySessionsChart;
        private Map<String, Integer> appointmentStatusDistribution;

        public Builder counselorName(String counselorName) { this.counselorName = counselorName; return this; }
        public Builder specialization(String specialization) { this.specialization = specialization; return this; }
        public Builder totalAssignedStudents(int totalAssignedStudents) { this.totalAssignedStudents = totalAssignedStudents; return this; }
        public Builder pendingRequestsCount(int pendingRequestsCount) { this.pendingRequestsCount = pendingRequestsCount; return this; }
        public Builder todayAppointmentsCount(int todayAppointmentsCount) { this.todayAppointmentsCount = todayAppointmentsCount; return this; }
        public Builder upcomingAppointmentsCount(int upcomingAppointmentsCount) { this.upcomingAppointmentsCount = upcomingAppointmentsCount; return this; }
        public Builder highRiskStudentsCount(int highRiskStudentsCount) { this.highRiskStudentsCount = highRiskStudentsCount; return this; }
        public Builder completedSessionsCount(int completedSessionsCount) { this.completedSessionsCount = completedSessionsCount; return this; }
        public Builder unreadMessagesCount(long unreadMessagesCount) { this.unreadMessagesCount = unreadMessagesCount; return this; }
        public Builder todayAppointments(List<Appointment> todayAppointments) { this.todayAppointments = todayAppointments; return this; }
        public Builder pendingRequests(List<CounselingRequest> pendingRequests) { this.pendingRequests = pendingRequests; return this; }
        public Builder highRiskStudents(List<Student> highRiskStudents) { this.highRiskStudents = highRiskStudents; return this; }
        public Builder assignedStudents(List<Student> assignedStudents) { this.assignedStudents = assignedStudents; return this; }
        public Builder riskLevelDistribution(Map<String, Integer> riskLevelDistribution) { this.riskLevelDistribution = riskLevelDistribution; return this; }
        public Builder monthlySessionsChart(Map<String, Integer> monthlySessionsChart) { this.monthlySessionsChart = monthlySessionsChart; return this; }
        public Builder appointmentStatusDistribution(Map<String, Integer> appointmentStatusDistribution) { this.appointmentStatusDistribution = appointmentStatusDistribution; return this; }

        public CounselorDashboardDTO build() {
            return new CounselorDashboardDTO(counselorName, specialization, totalAssignedStudents, pendingRequestsCount,
                    todayAppointmentsCount, upcomingAppointmentsCount, highRiskStudentsCount, completedSessionsCount,
                    unreadMessagesCount, todayAppointments, pendingRequests, highRiskStudents, assignedStudents,
                    riskLevelDistribution, monthlySessionsChart, appointmentStatusDistribution);
        }
    }

    public String getCounselorName() { return counselorName; }
    public void setCounselorName(String counselorName) { this.counselorName = counselorName; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public int getTotalAssignedStudents() { return totalAssignedStudents; }
    public void setTotalAssignedStudents(int totalAssignedStudents) { this.totalAssignedStudents = totalAssignedStudents; }
    public int getPendingRequestsCount() { return pendingRequestsCount; }
    public void setPendingRequestsCount(int pendingRequestsCount) { this.pendingRequestsCount = pendingRequestsCount; }
    public int getTodayAppointmentsCount() { return todayAppointmentsCount; }
    public void setTodayAppointmentsCount(int todayAppointmentsCount) { this.todayAppointmentsCount = todayAppointmentsCount; }
    public int getUpcomingAppointmentsCount() { return upcomingAppointmentsCount; }
    public void setUpcomingAppointmentsCount(int upcomingAppointmentsCount) { this.upcomingAppointmentsCount = upcomingAppointmentsCount; }
    public int getHighRiskStudentsCount() { return highRiskStudentsCount; }
    public void setHighRiskStudentsCount(int highRiskStudentsCount) { this.highRiskStudentsCount = highRiskStudentsCount; }
    public int getCompletedSessionsCount() { return completedSessionsCount; }
    public void setCompletedSessionsCount(int completedSessionsCount) { this.completedSessionsCount = completedSessionsCount; }
    public long getUnreadMessagesCount() { return unreadMessagesCount; }
    public void setUnreadMessagesCount(long unreadMessagesCount) { this.unreadMessagesCount = unreadMessagesCount; }
    public List<Appointment> getTodayAppointments() { return todayAppointments; }
    public void setTodayAppointments(List<Appointment> todayAppointments) { this.todayAppointments = todayAppointments; }
    public List<CounselingRequest> getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(List<CounselingRequest> pendingRequests) { this.pendingRequests = pendingRequests; }
    public List<Student> getHighRiskStudents() { return highRiskStudents; }
    public void setHighRiskStudents(List<Student> highRiskStudents) { this.highRiskStudents = highRiskStudents; }
    public List<Student> getAssignedStudents() { return assignedStudents; }
    public void setAssignedStudents(List<Student> assignedStudents) { this.assignedStudents = assignedStudents; }
    public Map<String, Integer> getRiskLevelDistribution() { return riskLevelDistribution; }
    public void setRiskLevelDistribution(Map<String, Integer> riskLevelDistribution) { this.riskLevelDistribution = riskLevelDistribution; }
    public Map<String, Integer> getMonthlySessionsChart() { return monthlySessionsChart; }
    public void setMonthlySessionsChart(Map<String, Integer> monthlySessionsChart) { this.monthlySessionsChart = monthlySessionsChart; }
    public Map<String, Integer> getAppointmentStatusDistribution() { return appointmentStatusDistribution; }
    public void setAppointmentStatusDistribution(Map<String, Integer> appointmentStatusDistribution) { this.appointmentStatusDistribution = appointmentStatusDistribution; }
}
