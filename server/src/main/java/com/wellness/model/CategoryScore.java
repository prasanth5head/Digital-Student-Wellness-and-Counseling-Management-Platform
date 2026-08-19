package com.wellness.model;

public class CategoryScore {
    private String category;
    private double score;
    private double maxScore;
    private double percentage;
    private RiskLevel riskLevel;
    private String statusDescription;

    public CategoryScore() {}

    public CategoryScore(String category, double score, double maxScore, double percentage, RiskLevel riskLevel, String statusDescription) {
        this.category = category;
        this.score = score;
        this.maxScore = maxScore;
        this.percentage = percentage;
        this.riskLevel = riskLevel;
        this.statusDescription = statusDescription;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String category;
        private double score;
        private double maxScore;
        private double percentage;
        private RiskLevel riskLevel;
        private String statusDescription;

        public Builder category(String category) { this.category = category; return this; }
        public Builder score(double score) { this.score = score; return this; }
        public Builder maxScore(double maxScore) { this.maxScore = maxScore; return this; }
        public Builder percentage(double percentage) { this.percentage = percentage; return this; }
        public Builder riskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; return this; }
        public Builder statusDescription(String statusDescription) { this.statusDescription = statusDescription; return this; }

        public CategoryScore build() {
            return new CategoryScore(category, score, maxScore, percentage, riskLevel, statusDescription);
        }
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }
    public double getMaxScore() { return maxScore; }
    public void setMaxScore(double maxScore) { this.maxScore = maxScore; }
    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }
    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }
    public String getStatusDescription() { return statusDescription; }
    public void setStatusDescription(String statusDescription) { this.statusDescription = statusDescription; }
}
