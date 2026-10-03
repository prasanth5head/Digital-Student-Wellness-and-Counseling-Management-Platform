package com.wellness.repository;

import com.wellness.model.MLPrediction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MLPredictionRepository extends MongoRepository<MLPrediction, String> {
    Optional<MLPrediction> findTopByStudentIdOrderByPredictedAtDesc(String studentId);
    Optional<MLPrediction> findByAssessmentId(String assessmentId);
    List<MLPrediction> findByStudentIdOrderByPredictedAtDesc(String studentId);
    void deleteByStudentId(String studentId);
}
