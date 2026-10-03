package com.wellness.dto;

import java.util.List;
import java.util.Map;

public class MLPredictionResponse {
    private String prediction;
    private Double probability;
    private Map<String, Double> classProbabilities;
    private String modelVersion;
    private List<Map<String, Object>> contributingFactors;
    private String screeningDisclaimer;

    public MLPredictionResponse() {}

    public String getPrediction() { return prediction; }
    public void setPrediction(String prediction) { this.prediction = prediction; }

    public Double getProbability() { return probability; }
    public void setProbability(Double probability) { this.probability = probability; }

    public Map<String, Double> getClassProbabilities() { return classProbabilities; }
    public void setClassProbabilities(Map<String, Double> classProbabilities) { this.classProbabilities = classProbabilities; }

    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }

    public List<Map<String, Object>> getContributingFactors() { return contributingFactors; }
    public void setContributingFactors(List<Map<String, Object>> contributingFactors) { this.contributingFactors = contributingFactors; }

    public String getScreeningDisclaimer() { return screeningDisclaimer; }
    public void setScreeningDisclaimer(String screeningDisclaimer) { this.screeningDisclaimer = screeningDisclaimer; }
}
