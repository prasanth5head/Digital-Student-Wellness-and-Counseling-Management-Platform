package com.wellness.service;

import com.wellness.dto.CounselingRequestCreateDTO;
import com.wellness.exception.ResourceNotFoundException;
import com.wellness.model.*;
import com.wellness.repository.CounselorRepository;
import com.wellness.repository.CounselingRequestRepository;
import com.wellness.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CounselingRequestService {

    private static final Logger log = LoggerFactory.getLogger(CounselingRequestService.class);

    private final CounselingRequestRepository requestRepository;
    private final StudentRepository studentRepository;
    private final CounselorRepository counselorRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public CounselingRequestService(CounselingRequestRepository requestRepository, StudentRepository studentRepository,
                                    CounselorRepository counselorRepository, NotificationService notificationService,
                                    AuditLogService auditLogService) {
        this.requestRepository = requestRepository;
        this.studentRepository = studentRepository;
        this.counselorRepository = counselorRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    public CounselingRequest createRequest(String studentId, CounselingRequestCreateDTO dto) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        String counselorName = null;
        String counselorUserId = null;
        if (dto.getPreferredCounselorId() != null && !dto.getPreferredCounselorId().isBlank()) {
            Counselor counselor = counselorRepository.findById(dto.getPreferredCounselorId()).orElse(null);
            if (counselor != null) {
                counselorName = counselor.getName();
                counselorUserId = counselor.getUserId();
            }
        }

        CounselingRequest request = CounselingRequest.builder()
                .studentId(student.getId())
                .studentName(student.getName())
                .studentRegisterNo(student.getRegisterNumber())
                .studentEmail(student.getEmail())
                .departmentName(student.getDepartmentName())
                .preferredCounselorId(dto.getPreferredCounselorId())
                .preferredCounselorName(counselorName)
                .requestType(dto.getRequestType())
                .preferredDate(dto.getPreferredDate())
                .preferredTimeSlot(dto.getPreferredTimeSlot())
                .reason(dto.getReason())
                .urgency(dto.getUrgency())
                .additionalNotes(dto.getAdditionalNotes())
                .status(RequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        CounselingRequest saved = requestRepository.save(request);

        if (counselorUserId != null) {
            notificationService.sendNotification(
                    counselorUserId,
                    "New Counseling Request from " + student.getName(),
                    "Type: " + dto.getRequestType() + " | Urgency: " + dto.getUrgency() + ". Please review and respond.",
                    NotificationType.COUNSELING_REQUEST,
                    "/counselor/requests"
            );
        } else {
            List<Counselor> activeCounselors = counselorRepository.findByActiveTrue();
            for (Counselor c : activeCounselors) {
                notificationService.sendNotification(
                        c.getUserId(),
                        "New Counseling Request: " + student.getName(),
                        "Urgency: " + dto.getUrgency() + " - " + dto.getRequestType(),
                        NotificationType.COUNSELING_REQUEST,
                        "/counselor/requests"
                );
            }
        }

        auditLogService.log(student.getUserId(), student.getName(), Role.ROLE_STUDENT, "CREATE_COUNSELING_REQUEST", "CounselingRequest", saved.getId(), "Urgency: " + dto.getUrgency(), null);

        return saved;
    }

    public List<CounselingRequest> getRequestsForStudent(String studentId) {
        return requestRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }

    public List<CounselingRequest> getRequestsForCounselor(String counselorId) {
        List<CounselingRequest> specific = requestRepository.findByPreferredCounselorIdOrderByCreatedAtDesc(counselorId);
        List<CounselingRequest> general = requestRepository.findByPreferredCounselorIdOrderByCreatedAtDesc(null);
        specific.addAll(general);
        return specific;
    }

    public Page<CounselingRequest> getAllRequests(int page, int size) {
        return requestRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
    }

    public CounselingRequest updateRequestStatus(String requestId, RequestStatus newStatus, String counselorNotes, String counselorUserId) {
        CounselingRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));

        request.setStatus(newStatus);
        request.setCounselorResponseNotes(counselorNotes);
        request.setUpdatedAt(LocalDateTime.now());

        CounselingRequest saved = requestRepository.save(request);

        Student student = studentRepository.findById(request.getStudentId()).orElse(null);
        if (student != null) {
            String title = "Counseling Request " + newStatus;
            String message = "Your counseling request for " + request.getRequestType() + " is now " + newStatus + ". " + (counselorNotes != null ? counselorNotes : "");
            NotificationType nType = newStatus == RequestStatus.ACCEPTED ? NotificationType.REQUEST_ACCEPTED : NotificationType.REQUEST_REJECTED;

            notificationService.sendNotification(
                    student.getUserId(),
                    title,
                    message,
                    nType,
                    "/student/requests"
            );
        }

        return saved;
    }
}
