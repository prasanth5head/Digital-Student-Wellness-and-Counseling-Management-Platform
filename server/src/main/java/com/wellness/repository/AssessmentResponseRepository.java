package com.wellness.repository;

import com.wellness.model.AssessmentResponse;
import com.wellness.model.RiskLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AssessmentResponseRepository extends MongoRepository<AssessmentResponse, String> {
    List<AssessmentResponse> findByStudentIdOrderByCreatedAtDesc(String studentId);
    Page<AssessmentResponse> findByStudentId(String studentId, Pageable pageable);
    List<AssessmentResponse> findByRiskLevel(RiskLevel riskLevel);
    List<AssessmentResponse> findByCreatedAtAfter(LocalDateTime date);
    long countByCreatedAtAfter(LocalDateTime date);
}
