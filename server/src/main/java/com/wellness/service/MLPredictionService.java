package com.wellness.service;

import com.wellness.dto.MLHealthResponse;
import com.wellness.dto.MLPredictionRequest;
import com.wellness.dto.MLPredictionResponse;
import com.wellness.model.MLPrediction;
import com.wellness.model.RiskLevel;
import com.wellness.repository.MLPredictionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class MLPredictionService {

    private static final Logger log = LoggerFactory.getLogger(MLPredictionService.class);

    private final MLPredictionRepository predictionRepository;
    private final RestTemplate restTemplate;
    private final String mlServiceUrl;

    @org.springframework.beans.factory.annotation.Autowired
    public MLPredictionService(MLPredictionRepository predictionRepository,
                               RestTemplateBuilder restTemplateBuilder,
                               @Value("${ml.service.url:http://localhost:8000}") String mlServiceUrl,
                               @Value("${ml.service.connect-timeout-ms:5000}") int connectTimeoutMs,
                               @Value("${ml.service.read-timeout-ms:10000}") int readTimeoutMs) {
        this.predictionRepository = predictionRepository;
        this.mlServiceUrl = mlServiceUrl;
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofMillis(connectTimeoutMs))
                .setReadTimeout(Duration.ofMillis(readTimeoutMs))
                .build();
    }

    public MLPredictionService(MLPredictionRepository predictionRepository,
                               RestTemplate restTemplate,
                               String mlServiceUrl) {
        this.predictionRepository = predictionRepository;
        this.restTemplate = restTemplate;
        this.mlServiceUrl = mlServiceUrl;
    }

    public MLHealthResponse checkHealth() {
        try {
            String url = mlServiceUrl + "/health";
            ResponseEntity<MLHealthResponse> response = restTemplate.getForEntity(url, MLHealthResponse.class);
            return response.getBody();
        } catch (Exception e) {
            log.warn("ML Service health check failed at {}: {}", mlServiceUrl, e.getMessage());
            MLHealthResponse down = new MLHealthResponse();
            down.setStatus("DOWN");
            down.setModelLoaded(false);
            return down;
        }
    }

    public MLPrediction predictWellnessRisk(String studentId, String assessmentId, Map<String, Object> features) {
        log.info("Requesting ML prediction for studentId: {}, assessmentId: {}", studentId, assessmentId);
        
        try {
            String url = mlServiceUrl + "/predict";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            MLPredictionRequest requestPayload = new MLPredictionRequest(studentId, assessmentId, features);
            HttpEntity<MLPredictionRequest> entity = new HttpEntity<>(requestPayload, headers);

            ResponseEntity<MLPredictionResponse> response = restTemplate.postForEntity(url, entity, MLPredictionResponse.class);
            MLPredictionResponse body = response.getBody();

            if (body == null || body.getPrediction() == null) {
                throw new IllegalStateException("Received empty prediction response from ML service");
            }

            RiskLevel riskLevel;
            try {
                riskLevel = RiskLevel.valueOf(body.getPrediction().toUpperCase().trim());
            } catch (Exception ex) {
                log.error("Unknown risk level string from ML service: {}", body.getPrediction());
                riskLevel = null;
            }

            MLPrediction prediction = MLPrediction.builder()
                    .studentId(studentId)
                    .assessmentId(assessmentId)
                    .prediction(riskLevel)
                    .probability(body.getProbability())
                    .classProbabilities(body.getClassProbabilities())
                    .contributingFactors(body.getContributingFactors())
                    .modelVersion(body.getModelVersion())
                    .status("SUCCESS")
                    .screeningDisclaimer(body.getScreeningDisclaimer())
                    .inputFeatures(features)
                    .predictedAt(LocalDateTime.now())
                    .build();

            MLPrediction saved = predictionRepository.save(prediction);
            log.info("ML Prediction succeeded: {} (Prob: {}%) | Version: {}",
                    riskLevel,
                    body.getProbability() != null ? Math.round(body.getProbability() * 100) : "N/A",
                    body.getModelVersion());
            return saved;

        } catch (Exception e) {
            log.error("ML Prediction service call failed: {}. Preserving assessment without fallback prediction.", e.getMessage());

            // VERY IMPORTANT: NO FALLBACK PREDICTION!
            // When ML is unavailable, store prediction record as UNAVAILABLE.
            // Never calculate risk manually or guess a score.
            MLPrediction unavailable = MLPrediction.builder()
                    .studentId(studentId)
                    .assessmentId(assessmentId)
                    .prediction(null)
                    .probability(null)
                    .classProbabilities(Collections.emptyMap())
                    .contributingFactors(Collections.emptyList())
                    .modelVersion("N/A")
                    .status("UNAVAILABLE")
                    .screeningDisclaimer("ML prediction service is currently unavailable. No automated risk level was assigned. Your assessment responses were preserved safely.")
                    .inputFeatures(features)
                    .predictedAt(LocalDateTime.now())
                    .build();

            return predictionRepository.save(unavailable);
        }
    }

    public Optional<MLPrediction> getPredictionByAssessmentId(String assessmentId) {
        return predictionRepository.findByAssessmentId(assessmentId);
    }

    public List<MLPrediction> getStudentPredictionHistory(String studentId) {
        return predictionRepository.findByStudentIdOrderByPredictedAtDesc(studentId);
    }
}
