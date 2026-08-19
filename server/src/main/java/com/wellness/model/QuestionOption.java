package com.wellness.model;

public class QuestionOption {
    private String text;
    private int scoreWeight = 5;

    public QuestionOption() {}

    public QuestionOption(String text, int scoreWeight) {
        this.text = text;
        this.scoreWeight = scoreWeight;
    }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public int getScoreWeight() { return scoreWeight; }
    public void setScoreWeight(int scoreWeight) { this.scoreWeight = scoreWeight; }
}
