package com.wellness.service;

import com.wellness.dto.AssessmentSubmitRequest;
import com.wellness.exception.BadRequestException;
import com.wellness.exception.ResourceNotFoundException;
import com.wellness.model.*;
import com.wellness.repository.AssessmentQuestionRepository;
import com.wellness.repository.AssessmentResponseRepository;
import com.wellness.repository.DepartmentRepository;
import com.wellness.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AssessmentService {

    private static final Logger log = LoggerFactory.getLogger(AssessmentService.class);

    private final AssessmentQuestionRepository questionRepository;
    private final AssessmentResponseRepository responseRepository;
    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public AssessmentService(AssessmentQuestionRepository questionRepository, AssessmentResponseRepository responseRepository,
                             StudentRepository studentRepository, DepartmentRepository departmentRepository,
                             NotificationService notificationService, AuditLogService auditLogService) {
        this.questionRepository = questionRepository;
        this.responseRepository = responseRepository;
        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    public List<AssessmentQuestion> getAllQuestions() {
        return questionRepository.findByActiveTrueOrderByOrderAsc();
    }

    public List<AssessmentQuestion> getAllQuestionsAdmin() {
        return questionRepository.findAllByOrderByOrderAsc();
    }

    public AssessmentQuestion createQuestion(AssessmentQuestion question) {
        if (question.getCreatedAt() == null) {
            question.setCreatedAt(LocalDateTime.now());
        }
        return questionRepository.save(question);
    }

    public AssessmentQuestion updateQuestion(String id, AssessmentQuestion updated) {
        AssessmentQuestion existing = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        existing.setCategory(updated.getCategory());
        existing.setQuestionText(updated.getQuestionText());
        existing.setType(updated.getType());
        existing.setOptions(updated.getOptions());
        existing.setMinRating(updated.getMinRating());
        existing.setMaxRating(updated.getMaxRating());
        existing.setMinLabel(updated.getMinLabel());
        existing.setMaxLabel(updated.getMaxLabel());
        existing.setOrder(updated.getOrder());
        existing.setActive(updated.isActive());
        return questionRepository.save(existing);
    }

    public void deleteQuestion(String id) {
        questionRepository.deleteById(id);
    }

    public AssessmentResponse submitAssessment(String studentId, AssessmentSubmitRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        Map<String, Object> answers = request.getAnswers();
        if (answers == null || answers.isEmpty()) {
            throw new BadRequestException("No answers submitted");
        }

        List<AssessmentQuestion> questions = questionRepository.findByActiveTrueOrderByOrderAsc();
        if (questions.isEmpty()) {
            throw new BadRequestException("No active questions available in assessment system");
        }

        Map<String, List<AssessmentQuestion>> categoryMap = questions.stream()
                .collect(Collectors.groupingBy(AssessmentQuestion::getCategory));

        List<CategoryScore> categoryScores = new ArrayList<>();
        double totalWeightedPercentage = 0.0;
        int categoryCount = 0;

        int calculatedStress = 30;
        int calculatedAnxiety = 25;
        int calculatedSleep = 70;

        for (Map.Entry<String, List<AssessmentQuestion>> entry : categoryMap.entrySet()) {
            String category = entry.getKey();
            List<AssessmentQuestion> catQuestions = entry.getValue();

            double earnedScore = 0.0;
            double maxScore = 0.0;

            for (AssessmentQuestion q : catQuestions) {
                Object ans = answers.get(q.getId());
                if (ans == null) continue;

                if (q.getType() == QuestionType.RATING_SCALE) {
                    double val = parseNumeric(ans);
                    boolean isInverted = category.equalsIgnoreCase("Stress") ||
                            category.equalsIgnoreCase("Anxiety") ||
                            category.equalsIgnoreCase("Academic Pressure") ||
                            category.equalsIgnoreCase("Workload");

                    int min = q.getMinRating() > 0 ? q.getMinRating() : 1;
                    int max = q.getMaxRating() > min ? q.getMaxRating() : 10;
                    double range = max - min;
                    double normalized = Math.max(0, Math.min(range, val - min));

                    if (isInverted) {
                        earnedScore += (range - normalized);
                    } else {
                        earnedScore += normalized;
                    }
                    maxScore += range;

                } else if (q.getType() == QuestionType.MULTIPLE_CHOICE || q.getType() == QuestionType.FREQUENCY) {
                    String selectedText = ans.toString();
                    int weight = 5;
                    if (q.getOptions() != null) {
                        for (QuestionOption opt : q.getOptions()) {
                            if (opt.getText().equalsIgnoreCase(selectedText)) {
                                weight = opt.getScoreWeight();
                                break;
                            }
                        }
                    }
                    earnedScore += weight;
                    maxScore += 10.0;

                } else if (q.getType() == QuestionType.YES_NO) {
                    boolean isYes = "yes".equalsIgnoreCase(ans.toString()) || "true".equalsIgnoreCase(ans.toString());
                    boolean positiveQuestion = !category.equalsIgnoreCase("Stress") && !category.equalsIgnoreCase("Anxiety");
                    if ((isYes && positiveQuestion) || (!isYes && !positiveQuestion)) {
                        earnedScore += 10.0;
                    } else {
                        earnedScore += 3.0;
                    }
                    maxScore += 10.0;
                }
            }

            if (maxScore == 0) maxScore = 10.0;
            double percentage = Math.round((earnedScore / maxScore) * 100.0 * 10.0) / 10.0;
            percentage = Math.max(5.0, Math.min(100.0, percentage));

            RiskLevel catRisk;
            String statusDesc;
            if (percentage >= 75.0) {
                catRisk = RiskLevel.LOW;
                statusDesc = "Healthy & Resilient";
            } else if (percentage >= 60.0) {
                catRisk = RiskLevel.MODERATE;
                statusDesc = "Mild Strain / Manageable";
            } else if (percentage >= 40.0) {
                catRisk = RiskLevel.HIGH;
                statusDesc = "Elevated Distress / Support Recommended";
            } else {
                catRisk = RiskLevel.CRITICAL;
                statusDesc = "Critical Strain / Immediate Attention";
            }

            categoryScores.add(CategoryScore.builder()
                    .category(category)
                    .score(Math.round(earnedScore * 10.0) / 10.0)
                    .maxScore(maxScore)
                    .percentage(percentage)
                    .riskLevel(catRisk)
                    .statusDescription(statusDesc)
                    .build());

            if (category.equalsIgnoreCase("Stress")) {
                calculatedStress = (int) Math.round(100.0 - percentage);
            } else if (category.equalsIgnoreCase("Anxiety")) {
                calculatedAnxiety = (int) Math.round(100.0 - percentage);
            } else if (category.equalsIgnoreCase("Sleep")) {
                calculatedSleep = (int) Math.round(percentage);
            }

            totalWeightedPercentage += percentage;
            categoryCount++;
        }

        int overallScore = categoryCount > 0 ? (int) Math.round(totalWeightedPercentage / categoryCount) : 75;
        overallScore = Math.max(10, Math.min(98, overallScore));

        RiskLevel overallRisk;
        if (overallScore >= 75) {
            overallRisk = RiskLevel.LOW;
        } else if (overallScore >= 60) {
            overallRisk = RiskLevel.MODERATE;
        } else if (overallScore >= 40) {
            overallRisk = RiskLevel.HIGH;
        } else {
            overallRisk = RiskLevel.CRITICAL;
        }

        String summary = generateWellnessSummary(overallScore, overallRisk, categoryScores);
        List<String> recommendations = generateRecommendations(overallRisk, categoryScores);

        AssessmentResponse response = AssessmentResponse.builder()
                .studentId(student.getId())
                .studentName(student.getName())
                .studentRegisterNo(student.getRegisterNumber())
                .departmentName(student.getDepartmentName())
                .answers(answers)
                .categoryScores(categoryScores)
                .overallScore(overallScore)
                .riskLevel(overallRisk)
                .summary(summary)
                .recommendations(recommendations)
                .createdAt(LocalDateTime.now())
                .build();

        AssessmentResponse savedResponse = responseRepository.save(response);

        student.setCurrentWellnessScore(overallScore);
        student.setStressScore(calculatedStress);
        student.setAnxietyScore(calculatedAnxiety);
        student.setSleepScore(calculatedSleep);
        student.setRiskLevel(overallRisk);
        student.setLastAssessmentDate(LocalDateTime.now());
        studentRepository.save(student);

        updateDepartmentMetrics(student.getDepartmentId(), student.getDepartmentName());

        notificationService.sendNotification(
                student.getUserId(),
                "Wellness Assessment Completed",
                "Your wellness score is " + overallScore + "/100 (" + overallRisk + " risk). View your personalized insights.",
                NotificationType.ASSESSMENT_REMINDER,
                "/student/assessment"
        );

        if (overallRisk == RiskLevel.HIGH || overallRisk == RiskLevel.CRITICAL) {
            if (student.getAssignedCounselorId() != null) {
                notificationService.sendNotification(
                        student.getAssignedCounselorId(),
                        "High Risk Assessment Alert: " + student.getName(),
                        "Student " + student.getName() + " (" + student.getRegisterNumber() + ") scored " + overallScore + "/100 (" + overallRisk + " risk). Prompt review recommended.",
                        NotificationType.COUNSELOR_FOLLOW_UP,
                        "/counselor/students/" + student.getId()
                );
            }
        }

        auditLogService.log(student.getUserId(), student.getName(), Role.ROLE_STUDENT, "SUBMIT_ASSESSMENT", "AssessmentResponse", savedResponse.getId(), "Wellness score: " + overallScore + ", Risk: " + overallRisk, null);

        return savedResponse;
    }

    public List<AssessmentResponse> getStudentAssessmentHistory(String studentId) {
        return responseRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }

    public AssessmentResponse getAssessmentById(String id) {
        return responseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment response not found with id: " + id));
    }

    private double parseNumeric(Object obj) {
        if (obj instanceof Number) {
            return ((Number) obj).doubleValue();
        }
        try {
            return Double.parseDouble(obj.toString());
        } catch (Exception e) {
            return 5.0;
        }
    }

    private String generateWellnessSummary(int score, RiskLevel risk, List<CategoryScore> categories) {
        StringBuilder sb = new StringBuilder();
        if (risk == RiskLevel.LOW) {
            sb.append("Your overall mental and emotional wellbeing is in a healthy, flourishing state (Score: ").append(score).append("/100). ");
            sb.append("You demonstrate strong coping mechanisms and balanced lifestyle habits. Keep nurturing your daily wellness routine.");
        } else if (risk == RiskLevel.MODERATE) {
            sb.append("Your wellness evaluation indicates mild to moderate stress (Score: ").append(score).append("/100). ");
            sb.append("While your baseline is stable, some areas like sleep or academic load may be causing fatigue. Proactive self-care is recommended.");
        } else if (risk == RiskLevel.HIGH) {
            sb.append("Your assessment shows elevated stress and emotional strain (Score: ").append(score).append("/100). ");
            sb.append("Several wellness dimensions are under noticeable pressure. Scheduling a 1-on-1 counseling session can provide effective guidance.");
        } else {
            sb.append("Your score indicates critical levels of stress and burnout (Score: ").append(score).append("/100). ");
            sb.append("We strongly encourage you to connect with a university counselor or campus support specialist as soon as possible.");
        }
        return sb.toString();
    }

    private List<String> generateRecommendations(RiskLevel risk, List<CategoryScore> categories) {
        List<String> recs = new ArrayList<>();

        for (CategoryScore cs : categories) {
            if (cs.getPercentage() < 60.0) {
                if (cs.getCategory().equalsIgnoreCase("Stress") || cs.getCategory().equalsIgnoreCase("Workload")) {
                    recs.add("Practice the 4-7-8 breathing technique and break study blocks into 25-minute Pomodoro sessions.");
                } else if (cs.getCategory().equalsIgnoreCase("Sleep")) {
                    recs.add("Establish a digital curfew 45 minutes before sleep and aim for consistent 7-8 hour sleep schedules.");
                } else if (cs.getCategory().equalsIgnoreCase("Anxiety")) {
                    recs.add("Try progressive muscle relaxation and structured journaling to de-escalate recurring worries.");
                } else if (cs.getCategory().equalsIgnoreCase("Academic Pressure")) {
                    recs.add("Consult with academic peer tutors or visit counselor office hours to develop a structured study roadmap.");
                } else if (cs.getCategory().equalsIgnoreCase("Social Wellbeing")) {
                    recs.add("Engage in campus wellness clubs or schedule informal catch-ups with friends to build social support.");
                }
            }
        }

        if (recs.isEmpty()) {
            recs.add("Maintain daily physical activity (e.g. 20-minute brisk walk) to keep endorphin levels optimal.");
            recs.add("Explore guided mindfulness audio tracks in the Wellness Resource Library.");
            recs.add("Keep a weekly gratitude journal to sustain emotional resilience.");
        }

        if (risk == RiskLevel.HIGH || risk == RiskLevel.CRITICAL) {
            recs.add(0, "Book a confidential 1-on-1 counseling appointment with a campus counselor.");
        }

        return recs;
    }

    private void updateDepartmentMetrics(String deptId, String deptName) {
        try {
            List<Student> deptStudents = (deptId != null && !deptId.isBlank()) ?
                    studentRepository.findByDepartmentId(deptId) :
                    studentRepository.findByDepartmentName(deptName);

            if (!deptStudents.isEmpty()) {
                double avg = deptStudents.stream()
                        .mapToInt(Student::getCurrentWellnessScore)
                        .average()
                        .orElse(75.0);

                int highRisk = (int) deptStudents.stream()
                        .filter(s -> s.getRiskLevel() == RiskLevel.HIGH || s.getRiskLevel() == RiskLevel.CRITICAL)
                        .count();

                if (deptId != null) {
                    departmentRepository.findById(deptId).ifPresent(d -> {
                        d.setAverageWellnessScore(Math.round(avg * 10.0) / 10.0);
                        d.setHighRiskCount(highRisk);
                        d.setStudentCount(deptStudents.size());
                        departmentRepository.save(d);
                    });
                }
            }
        } catch (Exception e) {
            log.error("Failed to update department metrics: {}", e.getMessage());
        }
    }
}
