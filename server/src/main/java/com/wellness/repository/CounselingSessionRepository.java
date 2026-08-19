package com.wellness.repository;

import com.wellness.model.CounselingSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CounselingSessionRepository extends MongoRepository<CounselingSession, String> {
    List<CounselingSession> findByStudentIdOrderBySessionDateDesc(String studentId);
    List<CounselingSession> findByCounselorIdOrderBySessionDateDesc(String counselorId);
    Optional<CounselingSession> findByAppointmentId(String appointmentId);
    long countByCounselorId(String counselorId);
}
