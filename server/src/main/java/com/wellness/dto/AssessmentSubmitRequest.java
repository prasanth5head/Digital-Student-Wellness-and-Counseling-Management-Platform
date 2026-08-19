package com.wellness.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.Map;

public class AssessmentSubmitRequest {
    @NotEmpty(message = "Answers map cannot be empty")
    private Map<String, Object> answers;

    public AssessmentSubmitRequest() {}

    public AssessmentSubmitRequest(Map<String, Object> answers) {
        this.answers = answers;
    }

    public Map<String, Object> getAnswers() { return answers; }
    public void setAnswers(Map<String, Object> answers) { this.answers = answers; }
}
