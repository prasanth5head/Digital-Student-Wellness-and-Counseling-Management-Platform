package com.wellness.service;

import com.wellness.model.Announcement;
import com.wellness.model.Counselor;
import com.wellness.model.Notification;
import com.wellness.model.NotificationType;
import com.wellness.model.Role;
import com.wellness.model.Student;
import com.wellness.model.User;
import com.wellness.repository.*;
import com.wellness.websocket.WebSocketPushService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AdminAnalyticsBroadcastTest {

    @Mock
    private StudentRepository studentRepository;
    @Mock
    private CounselorRepository counselorRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CounselingSessionRepository sessionRepository;
    @Mock
    private CounselingRequestRepository requestRepository;
    @Mock
    private AppointmentRepository appointmentRepository;
    @Mock
    private DepartmentRepository departmentRepository;
    @Mock
    private AssessmentResponseRepository responseRepository;
    @Mock
    private AnnouncementRepository announcementRepository;
    @Mock
    private AuditLogRepository auditLogRepository;
    @Mock
    private DepartmentService departmentService;
    @Mock
    private NotificationRepository notificationRepository;
    @Mock
    private WebSocketPushService webSocketPushService;

    private AdminAnalyticsService adminAnalyticsService;

    private Student studentCS;
    private Student studentECE;
    private Counselor counselor1;
    private User studentCSUser;
    private User studentECEUser;
    private User counselorUser;
    private User adminUser;

    @BeforeEach
    void setUp() {
        adminAnalyticsService = new AdminAnalyticsService(
                studentRepository, counselorRepository, userRepository,
                sessionRepository, requestRepository, appointmentRepository,
                departmentRepository, responseRepository, announcementRepository,
                auditLogRepository, departmentService, notificationRepository,
                webSocketPushService
        );

        studentCSUser = new User();
        studentCSUser.setId("u_stu_cs");
        studentCSUser.setRole(Role.ROLE_STUDENT);
        studentCSUser.setActive(true);

        studentECEUser = new User();
        studentECEUser.setId("u_stu_ece");
        studentECEUser.setRole(Role.ROLE_STUDENT);
        studentECEUser.setActive(true);

        counselorUser = new User();
        counselorUser.setId("u_coun_1");
        counselorUser.setRole(Role.ROLE_COUNSELOR);
        counselorUser.setActive(true);

        adminUser = new User();
        adminUser.setId("u_admin");
        adminUser.setRole(Role.ROLE_ADMIN);
        adminUser.setActive(true);

        studentCS = new Student();
        studentCS.setId("s_cs");
        studentCS.setUserId("u_stu_cs");
        studentCS.setDepartmentName("Computer Science");
        studentCS.setDepartmentId("dept_cs");

        studentECE = new Student();
        studentECE.setId("s_ece");
        studentECE.setUserId("u_stu_ece");
        studentECE.setDepartmentName("Electronics");
        studentECE.setDepartmentId("dept_ece");

        counselor1 = new Counselor();
        counselor1.setId("c_1");
        counselor1.setUserId("u_coun_1");
    }

    @Test
    void testBroadcastToAllCampus_DeliversToStudentsAndCounselors() {
        Announcement announcement = Announcement.builder()
                .title("Campus Health Fair")
                .content("Free wellness screenings tomorrow at the student center.")
                .targetAudience("ALL")
                .build();

        when(announcementRepository.save(any(Announcement.class))).thenAnswer(inv -> inv.getArgument(0));
        when(userRepository.findByActiveTrue()).thenReturn(List.of(studentCSUser, studentECEUser, counselorUser, adminUser));
        when(notificationRepository.existsByRecipientIdAndTitleAndType(anyString(), anyString(), any(NotificationType.class)))
                .thenReturn(false);

        Announcement saved = adminAnalyticsService.createAnnouncement(announcement);

        assertNotNull(saved);
        // Eligible recipients should be students + counselors = 3 (admin excluded)
        assertEquals(3, saved.getRecipientCount());

        ArgumentCaptor<List<Notification>> captor = ArgumentCaptor.forClass(List.class);
        verify(notificationRepository, times(1)).saveAll(captor.capture());
        List<Notification> capturedNotifications = captor.getValue();
        assertEquals(3, capturedNotifications.size());
        assertTrue(capturedNotifications.stream().anyMatch(n -> n.getRecipientId().equals("u_stu_cs")));
        assertTrue(capturedNotifications.stream().anyMatch(n -> n.getRecipientId().equals("u_stu_ece")));
        assertTrue(capturedNotifications.stream().anyMatch(n -> n.getRecipientId().equals("u_coun_1")));

        verify(webSocketPushService, times(3)).pushNotification(any(Notification.class));
        verify(webSocketPushService, times(1)).pushAnnouncement(any(Announcement.class));
    }

    @Test
    void testBroadcastToSpecificFaculty_DeliversOnlyToTargetFacultyStudents() {
        Announcement announcement = Announcement.builder()
                .title("CS Department Workshop")
                .content("AI ethics workshop this Friday.")
                .targetAudience("FACULTY")
                .targetFaculty("Computer Science")
                .build();

        when(announcementRepository.save(any(Announcement.class))).thenAnswer(inv -> inv.getArgument(0));
        when(studentRepository.findAll()).thenReturn(List.of(studentCS, studentECE));
        when(userRepository.findById("u_stu_cs")).thenReturn(Optional.of(studentCSUser));
        when(notificationRepository.existsByRecipientIdAndTitleAndType(anyString(), anyString(), any(NotificationType.class)))
                .thenReturn(false);

        Announcement saved = adminAnalyticsService.createAnnouncement(announcement);

        assertNotNull(saved);
        // Only studentCS matches "Computer Science"
        assertEquals(1, saved.getRecipientCount());

        ArgumentCaptor<List<Notification>> captor = ArgumentCaptor.forClass(List.class);
        verify(notificationRepository, times(1)).saveAll(captor.capture());
        List<Notification> capturedNotifications = captor.getValue();
        assertEquals(1, capturedNotifications.size());
        assertEquals("u_stu_cs", capturedNotifications.get(0).getRecipientId());
        assertEquals("CS Department Workshop", capturedNotifications.get(0).getTitle());
    }

    @Test
    void testBroadcastToStudentsOnly_ExcludesCounselorsAndAdmins() {
        Announcement announcement = Announcement.builder()
                .title("Final Exam Mental Health Tips")
                .content("Check out the new stress management guide.")
                .targetAudience("STUDENTS")
                .build();

        when(announcementRepository.save(any(Announcement.class))).thenAnswer(inv -> inv.getArgument(0));
        when(userRepository.findByRoleAndActiveTrue(Role.ROLE_STUDENT)).thenReturn(List.of(studentCSUser, studentECEUser));
        when(notificationRepository.existsByRecipientIdAndTitleAndType(anyString(), anyString(), any(NotificationType.class)))
                .thenReturn(false);

        Announcement saved = adminAnalyticsService.createAnnouncement(announcement);

        assertNotNull(saved);
        assertEquals(2, saved.getRecipientCount());

        ArgumentCaptor<List<Notification>> captor = ArgumentCaptor.forClass(List.class);
        verify(notificationRepository, times(1)).saveAll(captor.capture());
        List<Notification> capturedNotifications = captor.getValue();
        assertEquals(2, capturedNotifications.size());
        assertTrue(capturedNotifications.stream().anyMatch(n -> n.getRecipientId().equals("u_stu_cs")));
        assertTrue(capturedNotifications.stream().anyMatch(n -> n.getRecipientId().equals("u_stu_ece")));
        assertFalse(capturedNotifications.stream().anyMatch(n -> n.getRecipientId().equals("u_coun_1")));
    }

    @Test
    void testBroadcast_PreventsDuplicateNotifications() {
        Announcement announcement = Announcement.builder()
                .title("Campus Health Fair")
                .content("Free wellness screenings.")
                .targetAudience("STUDENTS")
                .build();

        when(announcementRepository.save(any(Announcement.class))).thenAnswer(inv -> inv.getArgument(0));
        when(userRepository.findByRoleAndActiveTrue(Role.ROLE_STUDENT)).thenReturn(List.of(studentCSUser, studentECEUser));
        // studentCSUser already received this notification previously!
        when(notificationRepository.existsByRecipientIdAndTitleAndType("u_stu_cs", "Campus Health Fair", NotificationType.ADMIN_ANNOUNCEMENT))
                .thenReturn(true);
        when(notificationRepository.existsByRecipientIdAndTitleAndType("u_stu_ece", "Campus Health Fair", NotificationType.ADMIN_ANNOUNCEMENT))
                .thenReturn(false);

        Announcement saved = adminAnalyticsService.createAnnouncement(announcement);

        assertNotNull(saved);
        // Only 1 new notification created (for studentECE)
        assertEquals(1, saved.getRecipientCount());

        ArgumentCaptor<List<Notification>> captor = ArgumentCaptor.forClass(List.class);
        verify(notificationRepository, times(1)).saveAll(captor.capture());
        List<Notification> capturedNotifications = captor.getValue();
        assertEquals(1, capturedNotifications.size());
        assertEquals("u_stu_ece", capturedNotifications.get(0).getRecipientId());
    }
}
