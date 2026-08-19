package com.wellness.websocket;

import com.wellness.model.Message;
import com.wellness.model.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketPushService {

    private static final Logger log = LoggerFactory.getLogger(WebSocketPushService.class);

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketPushService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void pushChatMessage(Message message) {
        try {
            messagingTemplate.convertAndSend("/topic/chat/" + message.getConversationId(), message);
            messagingTemplate.convertAndSend("/topic/messages/" + message.getRecipientId(), message);
        } catch (Exception e) {
            log.error("Failed to push chat message via STOMP: {}", e.getMessage());
        }
    }

    public void pushNotification(Notification notification) {
        try {
            messagingTemplate.convertAndSend("/topic/notifications/" + notification.getRecipientId(), notification);
        } catch (Exception e) {
            log.error("Failed to push notification via STOMP: {}", e.getMessage());
        }
    }

    public void pushAnnouncement(Object announcement) {
        try {
            messagingTemplate.convertAndSend("/topic/announcements", announcement);
        } catch (Exception e) {
            log.error("Failed to push announcement via STOMP: {}", e.getMessage());
        }
    }

    public void pushAppointmentUpdate(String userId, Object appointmentUpdate) {
        try {
            messagingTemplate.convertAndSend("/topic/appointments/" + userId, appointmentUpdate);
        } catch (Exception e) {
            log.error("Failed to push appointment update via STOMP: {}", e.getMessage());
        }
    }
}
