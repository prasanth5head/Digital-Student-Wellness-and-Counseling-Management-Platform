package com.wellness.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "announcements")
public class Announcement {
    @Id
    private String id;

    private String title;
    private String content;
    private String priority;
    private String targetRole;
    private String authorName;
    private boolean active = true;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Announcement() {}

    public Announcement(String id, String title, String content, String priority, String targetRole, String authorName, boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.priority = priority;
        this.targetRole = targetRole;
        this.authorName = authorName;
        this.active = active;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String title;
        private String content;
        private String priority;
        private String targetRole;
        private String authorName;
        private boolean active = true;
        private LocalDateTime createdAt = LocalDateTime.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder content(String content) { this.content = content; return this; }
        public Builder priority(String priority) { this.priority = priority; return this; }
        public Builder targetRole(String targetRole) { this.targetRole = targetRole; return this; }
        public Builder authorName(String authorName) { this.authorName = authorName; return this; }
        public Builder active(boolean active) { this.active = active; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Announcement build() {
            return new Announcement(id, title, content, priority, targetRole, authorName, active, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
