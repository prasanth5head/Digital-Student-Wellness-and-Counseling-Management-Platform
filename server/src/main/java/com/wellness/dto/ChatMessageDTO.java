package com.wellness.dto;

import com.wellness.model.Role;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class ChatMessageDTO {
    private String id;
    private String conversationId;
    private String senderId;
    private String senderName;
    private Role senderRole;

    @NotBlank(message = "Recipient ID is required")
    private String recipientId;

    private String recipientName;

    @NotBlank(message = "Message content is required")
    private String content;

    private boolean isRead;
    private LocalDateTime timestamp;

    public ChatMessageDTO() {}

    public ChatMessageDTO(String id, String conversationId, String senderId, String senderName, Role senderRole,
                          String recipientId, String recipientName, String content, boolean isRead, LocalDateTime timestamp) {
        this.id = id;
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.senderRole = senderRole;
        this.recipientId = recipientId;
        this.recipientName = recipientName;
        this.content = content;
        this.isRead = isRead;
        this.timestamp = timestamp;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String conversationId;
        private String senderId;
        private String senderName;
        private Role senderRole;
        private String recipientId;
        private String recipientName;
        private String content;
        private boolean isRead;
        private LocalDateTime timestamp;

        public Builder id(String id) { this.id = id; return this; }
        public Builder conversationId(String conversationId) { this.conversationId = conversationId; return this; }
        public Builder senderId(String senderId) { this.senderId = senderId; return this; }
        public Builder senderName(String senderName) { this.senderName = senderName; return this; }
        public Builder senderRole(Role senderRole) { this.senderRole = senderRole; return this; }
        public Builder recipientId(String recipientId) { this.recipientId = recipientId; return this; }
        public Builder recipientName(String recipientName) { this.recipientName = recipientName; return this; }
        public Builder content(String content) { this.content = content; return this; }
        public Builder isRead(boolean isRead) { this.isRead = isRead; return this; }
        public Builder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public ChatMessageDTO build() {
            return new ChatMessageDTO(id, conversationId, senderId, senderName, senderRole, recipientId, recipientName, content, isRead, timestamp);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }
    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public Role getSenderRole() { return senderRole; }
    public void setSenderRole(Role senderRole) { this.senderRole = senderRole; }
    public String getRecipientId() { return recipientId; }
    public void setRecipientId(String recipientId) { this.recipientId = recipientId; }
    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
