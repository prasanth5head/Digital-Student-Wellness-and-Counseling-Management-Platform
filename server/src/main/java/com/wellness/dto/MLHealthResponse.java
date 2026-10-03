package com.wellness.dto;

import java.util.List;

public class MLHealthResponse {
    private String status;
    private boolean modelLoaded;
    private String modelVersion;
    private List<String> features;
    private List<String> classes;

    public MLHealthResponse() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isModelLoaded() { return modelLoaded; }
    public void setModelLoaded(boolean modelLoaded) { this.modelLoaded = modelLoaded; }

    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }

    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features; }

    public List<String> getClasses() { return classes; }
    public void setClasses(List<String> classes) { this.classes = classes; }
}
