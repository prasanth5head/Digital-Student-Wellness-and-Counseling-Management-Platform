package com.wellness.service;

import com.wellness.dto.ChatMessageDTO;
import com.wellness.exception.ResourceNotFoundException;
import com.wellness.model.Counselor;
import com.wellness.model.Message;
import com.wellness.model.Role;
import com.wellness.model.Student;
import com.wellness.model.User;
import com.wellness.repository.CounselorRepository;
import com.wellness.repository.MessageRepository;
import com.wellness.repository.StudentRepository;
import com.wellness.repository.UserRepository;
import com.wellness.websocket.WebSocketPushService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ChatServiceTest {

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private CounselorRepository counselorRepository;

    @Mock
    private WebSocketPushService webSocketPushService;

    @Mock
    private NotificationService notificationService;

    private ChatService chatService;

    private User studentUser;
    private User counselorUser;
    private Student studentProfile;
    private Counselor counselorProfile;

    @BeforeEach
    void setUp() {
        chatService = new ChatService(messageRepository, userRepository, studentRepository, counselorRepository, webSocketPushService, notificationService);

        studentUser = new User();
        studentUser.setId("user_stu_123");
        studentUser.setName("Alice Student");
        studentUser.setEmail("alice@wellness.edu");
        studentUser.setRole(Role.ROLE_STUDENT);

        counselorUser = new User();
        counselorUser.setId("user_coun_456");
        counselorUser.setName("Dr. Bob Counselor");
        counselorUser.setEmail("bob@wellness.edu");
        counselorUser.setRole(Role.ROLE_COUNSELOR);

        studentProfile = new Student();
        studentProfile.setId("profile_stu_999");
        studentProfile.setUserId("user_stu_123");
        studentProfile.setName("Alice Student");

        counselorProfile = new Counselor();
        counselorProfile.setId("profile_coun_888");
        counselorProfile.setUserId("user_coun_456");
        counselorProfile.setName("Dr. Bob Counselor");
    }

    @Test
    void testResolveUser_WithDirectUserId() {
        when(userRepository.findById("user_stu_123")).thenReturn(Optional.of(studentUser));

        User resolved = chatService.resolveUser("user_stu_123");
        assertNotNull(resolved);
        assertEquals("user_stu_123", resolved.getId());
    }

    @Test
    void testResolveUser_WithStudentEntityId_ResolvesWithout404() {
        // Direct lookup by ID fails for user
        when(userRepository.findById("profile_stu_999")).thenReturn(Optional.empty());
        // Student repository finds student entity
        when(studentRepository.findById("profile_stu_999")).thenReturn(Optional.of(studentProfile));
        // User repository finds the linked user
        when(userRepository.findById("user_stu_123")).thenReturn(Optional.of(studentUser));

        User resolved = chatService.resolveUser("profile_stu_999");
        assertNotNull(resolved);
        assertEquals("user_stu_123", resolved.getId());
        assertEquals("Alice Student", resolved.getName());
    }

    @Test
    void testResolveUser_WithCounselorEntityId_ResolvesWithout404() {
        when(userRepository.findById("profile_coun_888")).thenReturn(Optional.empty());
        when(studentRepository.findById("profile_coun_888")).thenReturn(Optional.empty());
        when(counselorRepository.findById("profile_coun_888")).thenReturn(Optional.of(counselorProfile));
        when(userRepository.findById("user_coun_456")).thenReturn(Optional.of(counselorUser));

        User resolved = chatService.resolveUser("profile_coun_888");
        assertNotNull(resolved);
        assertEquals("user_coun_456", resolved.getId());
        assertEquals("Dr. Bob Counselor", resolved.getName());
    }

    @Test
    void testResolveUser_NonExistent_ThrowsResourceNotFoundException() {
        when(userRepository.findById("non_existent")).thenReturn(Optional.empty());
        when(studentRepository.findById("non_existent")).thenReturn(Optional.empty());
        when(counselorRepository.findById("non_existent")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> chatService.resolveUser("non_existent"));
    }

    @Test
    void testSendMessage_FromNewStudent_FirstMessageInitializesSafeConversation() {
        ChatMessageDTO dto = new ChatMessageDTO();
        // Frontend passed student user id as sender, and counselor profile id as recipient
        dto.setRecipientId("profile_coun_888");
        dto.setContent("Hello, I am a new student and I need help.");

        when(userRepository.findById("user_stu_123")).thenReturn(Optional.of(studentUser));
        when(userRepository.findById("profile_coun_888")).thenReturn(Optional.empty());
        when(studentRepository.findById("profile_coun_888")).thenReturn(Optional.empty());
        when(counselorRepository.findById("profile_coun_888")).thenReturn(Optional.of(counselorProfile));
        when(userRepository.findById("user_coun_456")).thenReturn(Optional.of(counselorUser));

        when(messageRepository.save(any(Message.class))).thenAnswer(invocation -> {
            Message m = invocation.getArgument(0);
            m.setId("msg_generated_1");
            return m;
        });

        Message sent = chatService.sendMessage("user_stu_123", dto);

        assertNotNull(sent);
        assertEquals("user_stu_123", sent.getSenderId());
        assertEquals("user_coun_456", sent.getRecipientId());
        assertEquals("Hello, I am a new student and I need help.", sent.getContent());
        assertFalse(sent.isRead());
        assertNotNull(sent.getConversationId());
        verify(messageRepository, times(1)).save(any(Message.class));
        verify(webSocketPushService, times(1)).pushChatMessage(any(Message.class));
    }

    @Test
    void testGetConversationBetweenUsers_WithEntityIdResolution() {
        when(userRepository.findById("profile_stu_999")).thenReturn(Optional.empty());
        when(studentRepository.findById("profile_stu_999")).thenReturn(Optional.of(studentProfile));
        when(userRepository.findById("user_stu_123")).thenReturn(Optional.of(studentUser));

        when(userRepository.findById("user_coun_456")).thenReturn(Optional.of(counselorUser));

        String expectedConvId = "user_coun_456_user_stu_123";
        if ("user_stu_123".compareTo("user_coun_456") < 0) {
            expectedConvId = "user_stu_123_user_coun_456";
        }

        Message sample = Message.builder()
                .id("m1")
                .senderId("user_stu_123")
                .recipientId("user_coun_456")
                .conversationId(expectedConvId)
                .content("Initial greeting")
                .build();
        when(messageRepository.findByConversationIdOrderByTimestampAsc(expectedConvId))
                .thenReturn(List.of(sample));

        List<Message> result = chatService.getConversationBetweenUsers("profile_stu_999", "user_coun_456");
        assertEquals(1, result.size());
        assertEquals("Initial greeting", result.get(0).getContent());
    }
}
