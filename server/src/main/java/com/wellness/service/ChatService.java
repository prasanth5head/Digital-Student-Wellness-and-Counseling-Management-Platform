package com.wellness.service;

import com.wellness.dto.ChatMessageDTO;
import com.wellness.exception.ResourceNotFoundException;
import com.wellness.model.Counselor;
import com.wellness.model.Message;
import com.wellness.model.NotificationType;
import com.wellness.model.Student;
import com.wellness.model.User;
import com.wellness.repository.CounselorRepository;
import com.wellness.repository.MessageRepository;
import com.wellness.repository.StudentRepository;
import com.wellness.repository.UserRepository;
import com.wellness.websocket.WebSocketPushService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CounselorRepository counselorRepository;
    private final WebSocketPushService webSocketPushService;
    private final NotificationService notificationService;

    public ChatService(MessageRepository messageRepository, UserRepository userRepository,
                       StudentRepository studentRepository, CounselorRepository counselorRepository,
                       WebSocketPushService webSocketPushService, NotificationService notificationService) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.counselorRepository = counselorRepository;
        this.webSocketPushService = webSocketPushService;
        this.notificationService = notificationService;
    }

    public User resolveUser(String idOrEntityId) {
        if (idOrEntityId == null || idOrEntityId.isBlank()) {
            throw new ResourceNotFoundException("User ID cannot be blank");
        }
        String cleanId = idOrEntityId.trim();

        // 1. Direct User lookup by ID
        Optional<User> userOpt = userRepository.findById(cleanId);
        if (userOpt.isPresent()) {
            return userOpt.get();
        }

        // 2. Direct User lookup by email (if email was passed)
        if (cleanId.contains("@")) {
            Optional<User> byEmail = userRepository.findByEmail(cleanId.toLowerCase());
            if (byEmail.isPresent()) {
                return byEmail.get();
            }
        }

        // 3. Student entity lookup by student.id
        Optional<Student> studentOpt = studentRepository.findById(cleanId);
        if (studentOpt.isPresent() && studentOpt.get().getUserId() != null) {
            Optional<User> u = userRepository.findById(studentOpt.get().getUserId());
            if (u.isPresent()) {
                return u.get();
            }
        }

        // 4. Student entity lookup by student.userId
        Optional<Student> studentByUserId = studentRepository.findByUserId(cleanId);
        if (studentByUserId.isPresent()) {
            Optional<User> u = userRepository.findById(studentByUserId.get().getUserId());
            if (u.isPresent()) {
                return u.get();
            }
        }

        // 5. Counselor entity lookup by counselor.id
        Optional<Counselor> counselorOpt = counselorRepository.findById(cleanId);
        if (counselorOpt.isPresent() && counselorOpt.get().getUserId() != null) {
            Optional<User> u = userRepository.findById(counselorOpt.get().getUserId());
            if (u.isPresent()) {
                return u.get();
            }
        }

        // 6. Counselor entity lookup by counselor.userId
        Optional<Counselor> counselorByUserId = counselorRepository.findByUserId(cleanId);
        if (counselorByUserId.isPresent()) {
            Optional<User> u = userRepository.findById(counselorByUserId.get().getUserId());
            if (u.isPresent()) {
                return u.get();
            }
        }

        log.error("Unable to resolve User for identifier: {}", cleanId);
        throw new ResourceNotFoundException("User not found for identifier: " + cleanId);
    }

    public Message sendMessage(String senderUserId, ChatMessageDTO dto) {
        User sender = resolveUser(senderUserId);
        User recipient = resolveUser(dto.getRecipientId());

        String conversationId = dto.getConversationId();
        if (conversationId == null || conversationId.isBlank()) {
            conversationId = generateConversationId(sender.getId(), recipient.getId());
        }

        Message message = Message.builder()
                .conversationId(conversationId)
                .senderId(sender.getId())
                .senderName(sender.getName())
                .senderRole(sender.getRole())
                .recipientId(recipient.getId())
                .recipientName(recipient.getName())
                .content(dto.getContent().trim())
                .isRead(false)
                .timestamp(LocalDateTime.now())
                .build();

        Message saved = messageRepository.save(message);

        webSocketPushService.pushChatMessage(saved);

        notificationService.sendNotification(
                recipient.getId(),
                "New Message from " + sender.getName(),
                dto.getContent().length() > 50 ? dto.getContent().substring(0, 47) + "..." : dto.getContent(),
                NotificationType.NEW_CHAT_MESSAGE,
                sender.getRole() == com.wellness.model.Role.ROLE_STUDENT ? "/counselor/chat" : "/student/chat"
        );

        return saved;
    }

    public List<Message> getConversationHistory(String conversationId) {
        return messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
    }

    public List<Message> getConversationBetweenUsers(String userA, String userB) {
        User uA = resolveUser(userA);
        User uB = resolveUser(userB);
        String convId = generateConversationId(uA.getId(), uB.getId());
        List<Message> messages = messageRepository.findByConversationIdOrderByTimestampAsc(convId);
        if (messages.isEmpty()) {
            String altConvId = generateConversationId(userA, userB);
            if (!altConvId.equals(convId)) {
                List<Message> alt = messageRepository.findByConversationIdOrderByTimestampAsc(altConvId);
                if (!alt.isEmpty()) {
                    return alt;
                }
            }
        }
        return messages;
    }

    public void markMessagesAsRead(String conversationId, String currentUserId) {
        User u = resolveUser(currentUserId);
        List<Message> messages = messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
        boolean changed = false;
        for (Message m : messages) {
            if ((m.getRecipientId().equals(u.getId()) || m.getRecipientId().equals(currentUserId)) && !m.isRead()) {
                m.setRead(true);
                changed = true;
            }
        }
        if (changed) {
            messageRepository.saveAll(messages);
        }
    }

    public long getUnreadCount(String userId) {
        User u = resolveUser(userId);
        return messageRepository.countByRecipientIdAndIsReadFalse(u.getId());
    }

    public static String generateConversationId(String id1, String id2) {
        String[] ids = {id1, id2};
        Arrays.sort(ids);
        return ids[0] + "_" + ids[1];
    }
}
