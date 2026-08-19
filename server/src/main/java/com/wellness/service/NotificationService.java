package com.wellness.service;

import com.wellness.exception.ResourceNotFoundException;
import com.wellness.model.Notification;
import com.wellness.model.NotificationType;
import com.wellness.repository.NotificationRepository;
import com.wellness.websocket.WebSocketPushService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final WebSocketPushService webSocketPushService;

    public NotificationService(NotificationRepository notificationRepository, WebSocketPushService webSocketPushService) {
        this.notificationRepository = notificationRepository;
        this.webSocketPushService = webSocketPushService;
    }

    public Notification sendNotification(String recipientId, String title, String message, NotificationType type, String link) {
        Notification notification = Notification.builder()
                .recipientId(recipientId)
                .title(title)
                .message(message)
                .type(type)
                .link(link)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        Notification saved = notificationRepository.save(notification);
        webSocketPushService.pushNotification(saved);
        return saved;
    }

    public List<Notification> getNotificationsForUser(String recipientId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId);
    }

    public Page<Notification> getNotificationsForUserPaginated(String recipientId, int page, int size) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId, PageRequest.of(page, size));
    }

    public long getUnreadCount(String recipientId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(recipientId);
    }

    public Notification markAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public void markAllAsRead(String recipientId) {
        List<Notification> unread = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
