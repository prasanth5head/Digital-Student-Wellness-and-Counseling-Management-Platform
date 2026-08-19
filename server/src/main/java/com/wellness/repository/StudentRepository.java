package com.wellness.repository;

import com.wellness.model.RiskLevel;
import com.wellness.model.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByUserId(String userId);
    Optional<Student> findByEmail(String email);
    Optional<Student> findByRegisterNumber(String registerNumber);
    boolean existsByRegisterNumber(String registerNumber);

    List<Student> findByDepartmentId(String departmentId);
    List<Student> findByDepartmentName(String departmentName);
    List<Student> findByAssignedCounselorId(String counselorId);
    List<Student> findByRiskLevel(RiskLevel riskLevel);

    Page<Student> findByNameContainingIgnoreCaseOrRegisterNumberContainingIgnoreCase(String name, String regNo, Pageable pageable);
}
