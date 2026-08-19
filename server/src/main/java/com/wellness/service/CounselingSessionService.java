package com.wellness.service;

import com.wellness.dto.CounselorNoteDTO;
import com.wellness.dto.SessionCreateDTO;
import com.wellness.exception.ResourceNotFoundException;
import com.wellness.model.*;
import com.wellness.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CounselingSessionService {

    private static final Logger log = LoggerFactory.getLogger(CounselingSessionService.class);

    private final CounselingSessionRepository sessionRepository;
    private final CounselorNoteRepository noteRepository;
    private final AppointmentRepository appointmentRepository;
    private final StudentRepository studentRepository;
    private final CounselorRepository counselorRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public CounselingSessionService(CounselingSessionRepository sessionRepository, CounselorNoteRepository noteRepository,
                                  AppointmentRepository appointmentRepository, StudentRepository studentRepository,
                                  CounselorRepository counselorRepository, NotificationService notificationService,
                                  AuditLogService auditLogService) {
        this.sessionRepository = sessionRepository;
        this.noteRepository = noteRepository;
        this.appointmentRepository = appointmentRepository;
        this.studentRepository = studentRepository;
        this.counselorRepository = counselorRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    public CounselingSession createSession(SessionCreateDTO dto, String counselorUserId) {
        Counselor counselor = counselorRepository.findByUserId(counselorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Counselor profile not found for user: " + counselorUserId));

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + dto.getStudentId()));

        CounselingSession session = CounselingSession.builder()
                .appointmentId(dto.getAppointmentId())
                .studentId(student.getId())
                .studentName(student.getName())
                .studentRegisterNo(student.getRegisterNumber())
                .counselorId(counselor.getId())
                .counselorName(counselor.getName())
                .sessionDate(dto.getSessionDate())
                .durationMinutes(dto.getDurationMinutes())
                .sessionType(dto.getSessionType())
                .sessionSummary(dto.getSessionSummary())
                .keyTakeaways(dto.getKeyTakeaways())
                .studentActionItems(dto.getStudentActionItems())
                .recommendedResourceIds(dto.getRecommendedResourceIds())
                .nextFollowUpDate(dto.getNextFollowUpDate())
                .createdAt(LocalDateTime.now())
                .build();

        CounselingSession savedSession = sessionRepository.save(session);

        if (dto.getAppointmentId() != null && !dto.getAppointmentId().isBlank()) {
            appointmentRepository.findById(dto.getAppointmentId()).ifPresent(app -> {
                app.setStatus(AppointmentStatus.COMPLETED);
                app.setSessionId(savedSession.getId());
                app.setUpdatedAt(LocalDateTime.now());
                appointmentRepository.save(app);
            });
        }

        counselor.setTotalSessionsConducted(counselor.getTotalSessionsConducted() + 1);
        counselorRepository.save(counselor);

        if (dto.getPrivateNotes() != null && !dto.getPrivateNotes().isBlank()) {
            RiskLevel clinicalRisk = RiskLevel.LOW;
            if (dto.getClinicalRiskRating() != null) {
                try {
                    clinicalRisk = RiskLevel.valueOf(dto.getClinicalRiskRating().toUpperCase());
                } catch (Exception ignored) {}
            }

            CounselorNote note = CounselorNote.builder()
                    .studentId(student.getId())
                    .counselorId(counselor.getId())
                    .counselorName(counselor.getName())
                    .sessionId(savedSession.getId())
                    .title("Session Clinical Note - " + dto.getSessionDate())
                    .privateNotes(dto.getPrivateNotes())
                    .clinicalRiskRating(clinicalRisk)
                    .mentalStatusObservations(dto.getMentalStatusObservations())
                    .interventionPlan(dto.getInterventionPlan())
                    .isConfidential(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            noteRepository.save(note);
        }

        notificationService.sendNotification(
                student.getUserId(),
                "Counseling Session Notes & Takeaways",
                "Counselor " + counselor.getName() + " published the summary and action items for your recent session.",
                NotificationType.COUNSELOR_FOLLOW_UP,
                "/student/appointments"
        );

        auditLogService.log(counselorUserId, counselor.getName(), Role.ROLE_COUNSELOR, "CREATE_SESSION", "CounselingSession", savedSession.getId(), "Student: " + student.getName(), null);

        return savedSession;
    }

    public List<CounselingSession> getSessionsForStudent(String studentId) {
        return sessionRepository.findByStudentIdOrderBySessionDateDesc(studentId);
    }

    public List<CounselingSession> getSessionsForCounselor(String counselorId) {
        return sessionRepository.findByCounselorIdOrderBySessionDateDesc(counselorId);
    }

    public CounselorNote saveCounselorNote(CounselorNoteDTO dto, String counselorUserId) {
        Counselor counselor = counselorRepository.findByUserId(counselorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Counselor profile not found"));

        CounselorNote note;
        if (dto.getId() != null && !dto.getId().isBlank()) {
            note = noteRepository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + dto.getId()));
            note.setTitle(dto.getTitle());
            note.setPrivateNotes(dto.getPrivateNotes());
            note.setClinicalRiskRating(dto.getClinicalRiskRating());
            note.setMentalStatusObservations(dto.getMentalStatusObservations());
            note.setInterventionPlan(dto.getInterventionPlan());
            note.setUpdatedAt(LocalDateTime.now());
        } else {
            note = CounselorNote.builder()
                    .studentId(dto.getStudentId())
                    .counselorId(counselor.getId())
                    .counselorName(counselor.getName())
                    .sessionId(dto.getSessionId())
                    .title(dto.getTitle())
                    .privateNotes(dto.getPrivateNotes())
                    .clinicalRiskRating(dto.getClinicalRiskRating() != null ? dto.getClinicalRiskRating() : RiskLevel.LOW)
                    .mentalStatusObservations(dto.getMentalStatusObservations())
                    .interventionPlan(dto.getInterventionPlan())
                    .isConfidential(true)
                    .createdAt(LocalDateTime.now())
                    .build();
        }

        return noteRepository.save(note);
    }

    public List<CounselorNote> getCounselorNotesForStudent(String studentId) {
        return noteRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }
}
