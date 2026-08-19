package com.wellness.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "assessmentQuestions")
public class AssessmentQuestion {
    @Id
    private String id;

    @Indexed
    private String category;

    private String questionText;
    private QuestionType type;
    private List<QuestionOption> options = new ArrayList<>();
    private int minRating = 1;
    private int maxRating = 10;
    private String minLabel;
    private String maxLabel;
    private int order;
    private boolean active = true;
    private LocalDateTime createdAt = LocalDateTime.now();

    public AssessmentQuestion() {}

    public AssessmentQuestion(String id, String category, String questionText, QuestionType type,
                              List<QuestionOption> options, int minRating, int maxRating,
                              String minLabel, String maxLabel, int order, boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.category = category;
        this.questionText = questionText;
        this.type = type;
        this.options = options != null ? options : new ArrayList<>();
        this.minRating = minRating;
        this.maxRating = maxRating;
        this.minLabel = minLabel;
        this.maxLabel = maxLabel;
        this.order = order;
        this.active = active;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String category;
        private String questionText;
        private QuestionType type;
        private List<QuestionOption> options = new ArrayList<>();
        private int minRating = 1;
        private int maxRating = 10;
        private String minLabel;
        private String maxLabel;
        private int order;
        private boolean active = true;
        private LocalDateTime createdAt = LocalDateTime.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder questionText(String questionText) { this.questionText = questionText; return this; }
        public Builder type(QuestionType type) { this.type = type; return this; }
        public Builder options(List<QuestionOption> options) { this.options = options; return this; }
        public Builder minRating(int minRating) { this.minRating = minRating; return this; }
        public Builder maxRating(int maxRating) { this.maxRating = maxRating; return this; }
        public Builder minLabel(String minLabel) { this.minLabel = minLabel; return this; }
        public Builder maxLabel(String maxLabel) { this.maxLabel = maxLabel; return this; }
        public Builder order(int order) { this.order = order; return this; }
        public Builder active(boolean active) { this.active = active; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public AssessmentQuestion build() {
            return new AssessmentQuestion(id, category, questionText, type, options, minRating, maxRating, minLabel, maxLabel, order, active, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public QuestionType getType() { return type; }
    public void setType(QuestionType type) { this.type = type; }
    public List<QuestionOption> getOptions() { return options; }
    public void setOptions(List<QuestionOption> options) { this.options = options; }
    public int getMinRating() { return minRating; }
    public void setMinRating(int minRating) { this.minRating = minRating; }
    public int getMaxRating() { return maxRating; }
    public void setMaxRating(int maxRating) { this.maxRating = maxRating; }
    public String getMinLabel() { return minLabel; }
    public void setMinLabel(String minLabel) { this.minLabel = minLabel; }
    public String getMaxLabel() { return maxLabel; }
    public void setMaxLabel(String maxLabel) { this.maxLabel = maxLabel; }
    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
