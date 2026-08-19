package com.wellness.repository;

import com.wellness.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
    Page<AuditLog> findAllByOrderByTimestampDesc(Pageable pageable);
    List<AuditLog> findTop50ByOrderByTimestampDesc();
    List<AuditLog> findByUserIdOrderByTimestampDesc(String userId);
    List<AuditLog> findByTimestampAfter(LocalDateTime date);
}
