package com.wellness.service;

import com.wellness.dto.DepartmentAnalyticsDTO;
import com.wellness.exception.ResourceNotFoundException;
import com.wellness.model.AssessmentResponse;
import com.wellness.model.CategoryScore;
import com.wellness.model.Department;
import com.wellness.model.RiskLevel;
import com.wellness.model.Student;
import com.wellness.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DepartmentService {

    private static final Logger log = LoggerFactory.getLogger(DepartmentService.class);

    private final DepartmentRepository departmentRepository;
    private final StudentRepository studentRepository;
    private final AssessmentResponseRepository responseRepository;
    private final CounselingRequestRepository requestRepository;
    private final CounselingSessionRepository sessionRepository;

    public DepartmentService(DepartmentRepository departmentRepository, StudentRepository studentRepository,
                             AssessmentResponseRepository responseRepository, CounselingRequestRepository requestRepository,
                             CounselingSessionRepository sessionRepository) {
        this.departmentRepository = departmentRepository;
        this.studentRepository = studentRepository;
        this.responseRepository = responseRepository;
        this.requestRepository = requestRepository;
        this.sessionRepository = sessionRepository;
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(String id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    }

    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }

    public Department updateDepartment(String id, Department updated) {
        Department existing = getDepartmentById(id);
        existing.setName(updated.getName());
        existing.setCode(updated.getCode());
        existing.setHeadOfDepartment(updated.getHeadOfDepartment());
        existing.setDescription(updated.getDescription());
        return departmentRepository.save(existing);
    }

    public void deleteDepartment(String id) {
        departmentRepository.deleteById(id);
    }

    public DepartmentAnalyticsDTO getDepartmentAnalytics(String departmentId) {
        Department dept = getDepartmentById(departmentId);
        List<Student> students = studentRepository.findByDepartmentId(dept.getId());
        if (students.isEmpty()) {
            students = studentRepository.findByDepartmentName(dept.getName());
        }

        int totalStudents = students.size();
        double avgScore = 0.0;
        int highRisk = 0;
        int modRisk = 0;
        int lowRisk = 0;

        Map<String, List<Double>> categoryScoreAccumulator = new HashMap<>();

        for (Student s : students) {
            avgScore += s.getCurrentWellnessScore();
            if (s.getRiskLevel() == RiskLevel.CRITICAL || s.getRiskLevel() == RiskLevel.HIGH) {
                highRisk++;
            } else if (s.getRiskLevel() == RiskLevel.MODERATE) {
                modRisk++;
            } else {
                lowRisk++;
            }

            List<AssessmentResponse> responses = responseRepository.findByStudentIdOrderByCreatedAtDesc(s.getId());
            if (!responses.isEmpty()) {
                AssessmentResponse latest = responses.get(0);
                if (latest.getCategoryScores() != null) {
                    for (CategoryScore cs : latest.getCategoryScores()) {
                        categoryScoreAccumulator
                                .computeIfAbsent(cs.getCategory(), k -> new ArrayList<>())
                                .add(cs.getPercentage());
                    }
                }
            }
        }

        double calculatedAvg = totalStudents > 0 ? Math.round((avgScore / totalStudents) * 10.0) / 10.0 : 75.0;

        Map<String, Double> categoryAverages = new HashMap<>();
        for (Map.Entry<String, List<Double>> entry : categoryScoreAccumulator.entrySet()) {
            double catAvg = entry.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(75.0);
            categoryAverages.put(entry.getKey(), Math.round(catAvg * 10.0) / 10.0);
        }

        long assessedCount = students.stream().filter(s -> s.getLastAssessmentDate() != null).count();
        double participationRate = totalStudents > 0 ? Math.round(((double) assessedCount / totalStudents) * 1000.0) / 10.0 : 0.0;

        return DepartmentAnalyticsDTO.builder()
                .departmentId(dept.getId())
                .departmentCode(dept.getCode())
                .departmentName(dept.getName())
                .totalStudents(totalStudents)
                .averageWellnessScore(calculatedAvg)
                .highRiskCount(highRisk)
                .moderateRiskCount(modRisk)
                .lowRiskCount(lowRisk)
                .totalCounselingRequests(dept.getActiveCounselingRequests())
                .completedSessions(dept.getCompletedSessions())
                .assessmentParticipationRate(participationRate)
                .categoryAverages(categoryAverages)
                .build();
    }
}
