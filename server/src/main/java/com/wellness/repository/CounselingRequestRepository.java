package com.wellness.repository;

import com.wellness.model.CounselingRequest;
import com.wellness.model.RequestStatus;
import com.wellness.model.UrgencyLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CounselingRequestRepository extends MongoRepository<CounselingRequest, String> {
    List<CounselingRequest> findByStudentIdOrderByCreatedAtDesc(String studentId);
    List<CounselingRequest> findByPreferredCounselorIdOrderByCreatedAtDesc(String counselorId);
    List<CounselingRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);
    List<CounselingRequest> findByUrgencyOrderByCreatedAtDesc(UrgencyLevel urgency);
    long countByStatus(RequestStatus status);
    Page<CounselingRequest> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
