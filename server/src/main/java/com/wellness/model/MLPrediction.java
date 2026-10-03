package com.wellness.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "ml_predictions")
public class MLPrediction {
    @Id
    private String id;

    @Indexed
    private String studentId;

    @Indexed
    private String assessmentId;

    private RiskLevel prediction;
    private Double probability;
    private Map<String, Double> classProbabilities = new HashMap<>();
    private List<Map<String, Object>> contributingFactors = new ArrayList<>();
    private String modelVersion;
    private String status; // "SUCCESS", "UNAVAILABLE", "ERROR"
    private String screeningDisclaimer;
    private Map<String, Object> inputFeatures = new HashMap<>();
    private LocalDateTime predictedAt = LocalDateTime.now();

    public MLPrediction() {}

    public MLPrediction(String id, String studentId, String assessmentId, RiskLevel prediction,
                        Double probability, Map<String, Double> classProbabilities,
                        List<Map<String, Object>> contributingFactors, String modelVersion,
                        String status, String screeningDisclaimer, Map<String, Object> inputFeatures,
                        LocalDateTime predictedAt) {
        this.id = id;
        this.studentId = studentId;
        this.assessmentId = assessmentId;
        this.prediction = prediction;
        this.probability = probability;
        this.classProbabilities = classProbabilities != null ? classProbabilities : new HashMap<>();
        this.contributingFactors = contributingFactors != null ? contributingFactors : new ArrayList<>();
        this.modelVersion = modelVersion;
        this.status = status;
        this.screeningDisclaimer = screeningDisclaimer;
        this.inputFeatures = inputFeatures != null ? inputFeatures : new HashMap<>();
        this.predictedAt = predictedAt != null ? predictedAt : LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String studentId;
        private String assessmentId;
        private RiskLevel prediction;
        private Double probability;
        private Map<String, Double> classProbabilities = new HashMap<>();
        private List<Map<String, Object>> contributingFactors = new ArrayList<>();
        private String modelVersion;
        private String status;
        private String screeningDisclaimer;
        private Map<String, Object> inputFeatures = new HashMap<>();
        private LocalDateTime predictedAt = LocalDateTime.now();

        public Builder id(String id) { this.id = id; return this; }
        public Builder studentId(String studentId) { this.studentId = studentId; return this; }
        public Builder assessmentId(String assessmentId) { this.assessmentId = assessmentId; return this; }
        public Builder prediction(RiskLevel prediction) { this.prediction = prediction; return this; }
        public Builder probability(Double probability) { this.probability = probability; return this; }
        public Builder classProbabilities(Map<String, Double> classProbabilities) { this.classProbabilities = classProbabilities; return this; }
        public Builder contributingFactors(List<Map<String, Object>> contributingFactors) { this.contributingFactors = contributingFactors; return this; }
        public Builder modelVersion(String modelVersion) { this.modelVersion = modelVersion; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder screeningDisclaimer(String screeningDisclaimer) { this.screeningDisclaimer = screeningDisclaimer; return this; }
        public Builder inputFeatures(Map<String, Object> inputFeatures) { this.inputFeatures = inputFeatures; return this; }
        public Builder predictedAt(LocalDateTime predictedAt) { this.predictedAt = predictedAt; return this; }

        public MLPrediction build() {
            return new MLPrediction(id, studentId, assessmentId, prediction, probability,
                    classProbabilities, contributingFactors, modelVersion, status,
                    screeningDisclaimer, inputFeatures, predictedAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getAssessmentId() { return assessmentId; }
    public void setAssessmentId(String assessmentId) { this.assessmentId = assessmentId; }

    public RiskLevel getPrediction() { return prediction; }
    public void setPrediction(RiskLevel prediction) { this.prediction = prediction; }

    public Double getProbability() { return probability; }
    public void setProbability(Double probability) { this.probability = probability; }

    public Map<String, Double> getClassProbabilities() { return classProbabilities; }
    public void setClassProbabilities(Map<String, Double> classProbabilities) { this.classProbabilities = classProbabilities; }

    public List<Map<String, Object>> getContributingFactors() { return contributingFactors; }
    public void setContributingFactors(List<Map<String, Object>> contributingFactors) { this.contributingFactors = contributingFactors; }

    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getScreeningDisclaimer() { return screeningDisclaimer; }
    public void setScreeningDisclaimer(String screeningDisclaimer) { this.screeningDisclaimer = screeningDisclaimer; }

    public Map<String, Object> getInputFeatures() { return inputFeatures; }
    public void setInputFeatures(Map<String, Object> inputFeatures) { this.inputFeatures = inputFeatures; }

    public LocalDateTime getPredictedAt() { return predictedAt; }
    public void setPredictedAt(LocalDateTime predictedAt) { this.predictedAt = predictedAt; }
}
