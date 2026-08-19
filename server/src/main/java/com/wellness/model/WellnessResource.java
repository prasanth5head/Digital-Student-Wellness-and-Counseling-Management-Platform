package com.wellness.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "resources")
public class WellnessResource {
    @Id
    private String id;

    private String title;
    private String description;

    @Indexed
    private String category;

    private String author;
    private String imageUrl;
    private String videoUrl;
    private String externalLink;
    private List<String> tags = new ArrayList<>();
    private String readTime;
    private String contentMarkdown;
    private int bookmarkCount = 0;
    private boolean featured = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    public WellnessResource() {}

    public WellnessResource(String id, String title, String description, String category, String author,
                            String imageUrl, String videoUrl, String externalLink, List<String> tags,
                            String readTime, String contentMarkdown, int bookmarkCount, boolean featured,
                            LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.author = author;
        this.imageUrl = imageUrl;
        this.videoUrl = videoUrl;
        this.externalLink = externalLink;
        this.tags = tags != null ? tags : new ArrayList<>();
        this.readTime = readTime;
        this.contentMarkdown = contentMarkdown;
        this.bookmarkCount = bookmarkCount;
        this.featured = featured;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String title;
        private String description;
        private String category;
        private String author;
        private String imageUrl;
        private String videoUrl;
        private String externalLink;
        private List<String> tags = new ArrayList<>();
        private String readTime;
        private String contentMarkdown;
        private int bookmarkCount = 0;
        private boolean featured = false;
        private LocalDateTime createdAt = LocalDateTime.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder author(String author) { this.author = author; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder videoUrl(String videoUrl) { this.videoUrl = videoUrl; return this; }
        public Builder externalLink(String externalLink) { this.externalLink = externalLink; return this; }
        public Builder tags(List<String> tags) { this.tags = tags; return this; }
        public Builder readTime(String readTime) { this.readTime = readTime; return this; }
        public Builder contentMarkdown(String contentMarkdown) { this.contentMarkdown = contentMarkdown; return this; }
        public Builder bookmarkCount(int bookmarkCount) { this.bookmarkCount = bookmarkCount; return this; }
        public Builder featured(boolean featured) { this.featured = featured; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public WellnessResource build() {
            return new WellnessResource(id, title, description, category, author, imageUrl, videoUrl, externalLink, tags, readTime, contentMarkdown, bookmarkCount, featured, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public String getExternalLink() { return externalLink; }
    public void setExternalLink(String externalLink) { this.externalLink = externalLink; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public String getReadTime() { return readTime; }
    public void setReadTime(String readTime) { this.readTime = readTime; }
    public String getContentMarkdown() { return contentMarkdown; }
    public void setContentMarkdown(String contentMarkdown) { this.contentMarkdown = contentMarkdown; }
    public int getBookmarkCount() { return bookmarkCount; }
    public void setBookmarkCount(int bookmarkCount) { this.bookmarkCount = bookmarkCount; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
