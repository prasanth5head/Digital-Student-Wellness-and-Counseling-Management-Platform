package com.wellness.service;

import com.wellness.dto.AppointmentCreateDTO;
import com.wellness.dto.AppointmentUpdateDTO;
import com.wellness.exception.ConflictException;
import com.wellness.exception.ResourceNotFoundException;
import com.wellness.model.*;
import com.wellness.repository.AppointmentRepository;
import com.wellness.repository.CounselingRequestRepository;
import com.wellness.repository.CounselorRepository;
import com.wellness.repository.StudentRepository;
import com.wellness.websocket.WebSocketPushService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AppointmentService {

    private static final Logger log = LoggerFactory.getLogger(AppointmentService.class);

    private final AppointmentRepository appointmentRepository;
    private final StudentRepository studentRepository;
    private final CounselorRepository counselorRepository;
    private final CounselingRequestRepository requestRepository;
    private final NotificationService notificationService;
    private final WebSocketPushService webSocketPushService;
    private final AuditLogService auditLogService;

    public AppointmentService(AppointmentRepository appointmentRepository, StudentRepository studentRepository,
                              CounselorRepository counselorRepository, CounselingRequestRepository requestRepository,
                              NotificationService notificationService, WebSocketPushService webSocketPushService,
                              AuditLogService auditLogService) {
        this.appointmentRepository = appointmentRepository;
        this.studentRepository = studentRepository;
        this.counselorRepository = counselorRepository;
        this.requestRepository = requestRepository;
        this.notificationService = notificationService;
        this.webSocketPushService = webSocketPushService;
        this.auditLogService = auditLogService;
    }

    public Appointment createAppointment(AppointmentCreateDTO dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + dto.getStudentId()));

        Counselor counselor = counselorRepository.findById(dto.getCounselorId())
                .orElseThrow(() -> new ResourceNotFoundException("Counselor not found with id: " + dto.getCounselorId()));

        List<Appointment> counselorConflicts = appointmentRepository.findByCounselorIdAndAppointmentDateAndStartTimeAndStatusNot(
                counselor.getId(), dto.getAppointmentDate(), dto.getStartTime(), AppointmentStatus.CANCELLED);
        if (!counselorConflicts.isEmpty()) {
            throw new ConflictException("Counselor is already booked on " + dto.getAppointmentDate() + " at " + dto.getStartTime());
        }

        List<Appointment> studentConflicts = appointmentRepository.findByStudentIdAndAppointmentDateAndStartTimeAndStatusNot(
                student.getId(), dto.getAppointmentDate(), dto.getStartTime(), AppointmentStatus.CANCELLED);
        if (!studentConflicts.isEmpty()) {
            throw new ConflictException("Student already has an active appointment on " + dto.getAppointmentDate() + " at " + dto.getStartTime());
        }

        String meetingLink = dto.getMeetingLink();
        if (dto.getMode() == AppointmentMode.ONLINE && (meetingLink == null || meetingLink.isBlank())) {
            meetingLink = "https://meet.aurawell.edu/session-" + UUID.randomUUID().toString().substring(0, 8);
        }

        Appointment appointment = Appointment.builder()
                .studentId(student.getId())
                .studentName(student.getName())
                .studentRegisterNo(student.getRegisterNumber())
                .studentEmail(student.getEmail())
                .studentDepartment(student.getDepartmentName())
                .counselorId(counselor.getId())
                .counselorName(counselor.getName())
                .counselorEmail(counselor.getEmail())
                .requestId(dto.getRequestId())
                .appointmentDate(dto.getAppointmentDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .mode(dto.getMode())
                .meetingLink(meetingLink)
                .location(dto.getLocation() != null ? dto.getLocation() : counselor.getOfficeLocation())
                .status(AppointmentStatus.CONFIRMED)
                .purpose(dto.getPurpose() != null ? dto.getPurpose() : "Wellness & Mental Health Counseling")
                .notes(dto.getNotes())
                .createdAt(LocalDateTime.now())
                .build();

        Appointment saved = appointmentRepository.save(appointment);

        if (dto.getRequestId() != null && !dto.getRequestId().isBlank()) {
            requestRepository.findById(dto.getRequestId()).ifPresent(req -> {
                req.setStatus(RequestStatus.SCHEDULED);
                req.setScheduledAppointmentId(saved.getId());
                req.setUpdatedAt(LocalDateTime.now());
                requestRepository.save(req);
            });
        }

        if (student.getAssignedCounselorId() == null) {
            student.setAssignedCounselorId(counselor.getId());
            student.setAssignedCounselorName(counselor.getName());
            studentRepository.save(student);
        }

        notificationService.sendNotification(
                student.getUserId(),
                "Appointment Confirmed with " + counselor.getName(),
                "Your counseling session is confirmed for " + saved.getAppointmentDate() + " at " + saved.getStartTime() + " (" + saved.getMode() + ").",
                NotificationType.APPOINTMENT_CONFIRMED,
                "/student/appointments"
        );

        notificationService.sendNotification(
                counselor.getUserId(),
                "New Appointment Scheduled: " + student.getName(),
                "Session confirmed on " + saved.getAppointmentDate() + " at " + saved.getStartTime(),
                NotificationType.APPOINTMENT_CONFIRMED,
                "/counselor/appointments"
        );

        webSocketPushService.pushAppointmentUpdate(student.getUserId(), saved);
        webSocketPushService.pushAppointmentUpdate(counselor.getUserId(), saved);

        auditLogService.log(student.getUserId(), student.getName(), Role.ROLE_STUDENT, "CREATE_APPOINTMENT", "Appointment", saved.getId(), "Date: " + saved.getAppointmentDate() + " " + saved.getStartTime(), null);

        return saved;
    }

    public Appointment updateAppointment(String id, AppointmentUpdateDTO dto) {
        Appointment existing = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        if (dto.getAppointmentDate() != null) existing.setAppointmentDate(dto.getAppointmentDate());
        if (dto.getStartTime() != null) existing.setStartTime(dto.getStartTime());
        if (dto.getEndTime() != null) existing.setEndTime(dto.getEndTime());
        if (dto.getMode() != null) existing.setMode(dto.getMode());
        if (dto.getMeetingLink() != null) existing.setMeetingLink(dto.getMeetingLink());
        if (dto.getLocation() != null) existing.setLocation(dto.getLocation());
        if (dto.getStatus() != null) existing.setStatus(dto.getStatus());
        if (dto.getCancellationReason() != null) existing.setCancellationReason(dto.getCancellationReason());
        if (dto.getNotes() != null) existing.setNotes(dto.getNotes());
        existing.setUpdatedAt(LocalDateTime.now());

        Appointment saved = appointmentRepository.save(existing);

        Student student = studentRepository.findById(saved.getStudentId()).orElse(null);
        Counselor counselor = counselorRepository.findById(saved.getCounselorId()).orElse(null);

        if (student != null) {
            webSocketPushService.pushAppointmentUpdate(student.getUserId(), saved);
            if (saved.getStatus() == AppointmentStatus.CANCELLED) {
                notificationService.sendNotification(
                        student.getUserId(),
                        "Appointment Cancelled",
                        "Your appointment on " + saved.getAppointmentDate() + " was cancelled. Reason: " + saved.getCancellationReason(),
                        NotificationType.APPOINTMENT_CANCELLED,
                        "/student/appointments"
                );
            }
        }

        if (counselor != null) {
            webSocketPushService.pushAppointmentUpdate(counselor.getUserId(), saved);
        }

        return saved;
    }

    public Appointment cancelAppointment(String id, String reason, String userId) {
        Appointment app = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        app.setStatus(AppointmentStatus.CANCELLED);
        app.setCancellationReason(reason != null ? reason : "Cancelled by user");
        app.setUpdatedAt(LocalDateTime.now());

        Appointment saved = appointmentRepository.save(app);

        Student student = studentRepository.findById(saved.getStudentId()).orElse(null);
        Counselor counselor = counselorRepository.findById(saved.getCounselorId()).orElse(null);

        if (student != null) {
            notificationService.sendNotification(
                    student.getUserId(),
                    "Appointment Cancelled",
                    "Session on " + saved.getAppointmentDate() + " has been cancelled.",
                    NotificationType.APPOINTMENT_CANCELLED,
                    "/student/appointments"
            );
        }

        if (counselor != null) {
            notificationService.sendNotification(
                    counselor.getUserId(),
                    "Appointment Cancelled: " + saved.getStudentName(),
                    "Session on " + saved.getAppointmentDate() + " has been cancelled. Reason: " + reason,
                    NotificationType.APPOINTMENT_CANCELLED,
                    "/counselor/appointments"
            );
        }

        return saved;
    }

    public List<Appointment> getAppointmentsForStudent(String studentId) {
        return appointmentRepository.findByStudentIdOrderByAppointmentDateDescStartTimeDesc(studentId);
    }

    public List<Appointment> getAppointmentsForCounselor(String counselorId) {
        return appointmentRepository.findByCounselorIdOrderByAppointmentDateDescStartTimeDesc(counselorId);
    }

    public List<Appointment> getAppointmentsForDate(String counselorId, LocalDate date) {
        return appointmentRepository.findByCounselorIdAndAppointmentDate(counselorId, date);
    }

    public Page<Appointment> getAllAppointments(int page, int size) {
        return appointmentRepository.findAllByOrderByAppointmentDateDescStartTimeDesc(PageRequest.of(page, size));
    }
}
