package com.wellness.repository;

import com.wellness.model.AssessmentQuestion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentQuestionRepository extends MongoRepository<AssessmentQuestion, String> {
    List<AssessmentQuestion> findByActiveTrueOrderByOrderAsc();
    List<AssessmentQuestion> findByCategoryAndActiveTrue(String category);
    List<AssessmentQuestion> findAllByOrderByOrderAsc();
}
