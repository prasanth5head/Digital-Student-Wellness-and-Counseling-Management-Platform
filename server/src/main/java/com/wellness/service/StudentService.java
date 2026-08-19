package com.wellness.service;

import com.wellness.dto.StudentDashboardDTO;
import com.wellness.dto.StudentDTO;
import com.wellness.exception.ResourceNotFoundException;
import com.wellness.model.*;
import com.wellness.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private static final Logger log = LoggerFactory.getLogger(StudentService.class);

    private final StudentRepository studentRepository;
    private final AssessmentResponseRepository responseRepository;
    private final AppointmentRepository appointmentRepository;
    private final CounselingRequestRepository requestRepository;
    private final NotificationRepository notificationRepository;
    private final WellnessResourceService resourceService;

    public StudentService(StudentRepository studentRepository, AssessmentResponseRepository responseRepository,
                          AppointmentRepository appointmentRepository, CounselingRequestRepository requestRepository,
                          NotificationRepository notificationRepository, WellnessResourceService resourceService) {
        this.studentRepository = studentRepository;
        this.responseRepository = responseRepository;
        this.appointmentRepository = appointmentRepository;
        this.requestRepository = requestRepository;
        this.notificationRepository = notificationRepository;
        this.resourceService = resourceService;
    }

    public StudentDashboardDTO getStudentDashboard(String userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + userId));

        List<AssessmentResponse> responses = responseRepository.findByStudentIdOrderByCreatedAtDesc(student.getId());
        AssessmentResponse recentAssessment = responses.isEmpty() ? null : responses.get(0);
        List<CategoryScore> latestCategoryScores = recentAssessment != null ? recentAssessment.getCategoryScores() : Collections.emptyList();

        List<Map<String, Object>> scoreTrend = new ArrayList<>();
        List<AssessmentResponse> chronological = new ArrayList<>(responses);
        Collections.reverse(chronological);

        if (!chronological.isEmpty()) {
            for (AssessmentResponse ar : chronological) {
                int st = 30;
                int sl = 70;
                if (ar.getCategoryScores() != null) {
                    for (CategoryScore cs : ar.getCategoryScores()) {
                        if (cs.getCategory().equalsIgnoreCase("Stress")) {
                            st = (int) Math.round(100.0 - cs.getPercentage());
                        } else if (cs.getCategory().equalsIgnoreCase("Sleep")) {
                            sl = (int) Math.round(cs.getPercentage());
                        }
                    }
                }
                scoreTrend.add(Map.of(
                        "date", ar.getCreatedAt().toLocalDate().format(DateTimeFormatter.ISO_DATE),
                        "score", ar.getOverallScore(),
                        "stress", st,
                        "sleep", sl
                ));
            }
        }

        List<Appointment> allAppointments = appointmentRepository.findByStudentIdOrderByAppointmentDateDescStartTimeDesc(student.getId());
        List<Appointment> upcomingAppointments = allAppointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.UPCOMING || a.getStatus() == AppointmentStatus.CONFIRMED)
                .sorted(Comparator.comparing(Appointment::getAppointmentDate))
                .collect(Collectors.toList());

        Appointment nextAppointment = upcomingAppointments.isEmpty() ? null : upcomingAppointments.get(0);

        List<CounselingRequest> pendingRequests = requestRepository.findByStudentIdOrderByCreatedAtDesc(student.getId()).stream()
                .filter(r -> r.getStatus() == RequestStatus.PENDING || r.getStatus() == RequestStatus.ACCEPTED)
                .collect(Collectors.toList());

        long unreadCount = notificationRepository.countByRecipientIdAndIsReadFalse(userId);
        List<Notification> recentNotifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId).stream()
                .limit(5)
                .collect(Collectors.toList());

        List<WellnessResource> recommendedResources = resourceService.getRecommendationsForStudent(student.getId());

        String dailyTip = getDailyWellnessTip();

        String wellnessStatus;
        if (student.getCurrentWellnessScore() == null) wellnessStatus = "Pending Initial Assessment";
        else if (student.getCurrentWellnessScore() >= 80) wellnessStatus = "Flourishing & Resilient";
        else if (student.getCurrentWellnessScore() >= 65) wellnessStatus = "Balanced & Stable";
        else if (student.getCurrentWellnessScore() >= 50) wellnessStatus = "Elevated Strain";
        else wellnessStatus = "Support Needed";

        return StudentDashboardDTO.builder()
                .studentName(student.getName())
                .registerNumber(student.getRegisterNumber())
                .departmentName(student.getDepartmentName())
                .yearOfStudy(student.getYearOfStudy())
                .currentWellnessScore(student.getCurrentWellnessScore())
                .stressScore(student.getStressScore())
                .anxietyScore(student.getAnxietyScore())
                .sleepScore(student.getSleepScore())
                .riskLevel(student.getRiskLevel())
                .wellnessStatus(wellnessStatus)
                .recentAssessment(recentAssessment)
                .latestCategoryScores(latestCategoryScores)
                .scoreTrend(scoreTrend)
                .nextAppointment(nextAppointment)
                .upcomingAppointments(upcomingAppointments)
                .pendingRequests(pendingRequests)
                .unreadNotificationCount(unreadCount)
                .recentNotifications(recentNotifications)
                .recommendedResources(recommendedResources)
                .dailyTip(dailyTip)
                .build();
    }

    public Student getStudentByUserId(String userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user: " + userId));
    }

    public Student getStudentById(String id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    public Student updateStudentProfile(String userId, StudentDTO dto) {
        Student student = getStudentByUserId(userId);
        if (dto.getContactNumber() != null) student.setContactNumber(dto.getContactNumber());
        if (dto.getEmergencyContact() != null) student.setEmergencyContact(dto.getEmergencyContact());
        if (dto.getBio() != null) student.setBio(dto.getBio());
        if (dto.getYearOfStudy() > 0) student.setYearOfStudy(dto.getYearOfStudy());
        return studentRepository.save(student);
    }

    public Page<Student> searchStudents(String search, int page, int size) {
        if (search != null && !search.isBlank()) {
            return studentRepository.findByNameContainingIgnoreCaseOrRegisterNumberContainingIgnoreCase(search, search, PageRequest.of(page, size));
        }
        return studentRepository.findAll(PageRequest.of(page, size));
    }

    private String getDailyWellnessTip() {
        String[] tips = {
                "Take a 5-minute break every 50 minutes of deep study to reset your focus and eye strain.",
                "Hydration directly impacts cognitive performance: aim for at least 8 glasses of water today.",
                "Mindful breathing for just 2 minutes lowers cortisol and stabilizes heart rate before exams.",
                "Quality sleep improves memory consolidation by up to 40% — set a regular sleep schedule.",
                "A 15-minute walk outdoors in natural light boosts serotonin and refreshes mental endurance."
        };
        int index = Math.abs(LocalDate.now().getDayOfYear()) % tips.length;
        return tips[index];
    }
}
