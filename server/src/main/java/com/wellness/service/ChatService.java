package com.wellness.service;

import com.wellness.dto.ChatMessageDTO;
import com.wellness.exception.ResourceNotFoundException;
import com.wellness.model.Message;
import com.wellness.model.NotificationType;
import com.wellness.model.User;
import com.wellness.repository.MessageRepository;
import com.wellness.repository.UserRepository;
import com.wellness.websocket.WebSocketPushService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final WebSocketPushService webSocketPushService;
    private final NotificationService notificationService;

    public ChatService(MessageRepository messageRepository, UserRepository userRepository,
                       WebSocketPushService webSocketPushService, NotificationService notificationService) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.webSocketPushService = webSocketPushService;
        this.notificationService = notificationService;
    }

    public Message sendMessage(String senderUserId, ChatMessageDTO dto) {
        User sender = userRepository.findById(senderUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender user not found: " + senderUserId));

        User recipient = userRepository.findById(dto.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient user not found: " + dto.getRecipientId()));

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
        String convId = generateConversationId(userA, userB);
        return messageRepository.findByConversationIdOrderByTimestampAsc(convId);
    }

    public void markMessagesAsRead(String conversationId, String currentUserId) {
        List<Message> messages = messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
        boolean changed = false;
        for (Message m : messages) {
            if (m.getRecipientId().equals(currentUserId) && !m.isRead()) {
                m.setRead(true);
                changed = true;
            }
        }
        if (changed) {
            messageRepository.saveAll(messages);
        }
    }

    public long getUnreadCount(String userId) {
        return messageRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    public static String generateConversationId(String id1, String id2) {
        String[] ids = {id1, id2};
        Arrays.sort(ids);
        return ids[0] + "_" + ids[1];
    }
}
