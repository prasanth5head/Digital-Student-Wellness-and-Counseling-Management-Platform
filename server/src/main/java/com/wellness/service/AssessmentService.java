package com.wellness.service;

import com.wellness.dto.AssessmentSubmitRequest;
import com.wellness.exception.BadRequestException;
import com.wellness.exception.ResourceNotFoundException;
import com.wellness.model.*;
import com.wellness.repository.AssessmentQuestionRepository;
import com.wellness.repository.AssessmentResponseRepository;
import com.wellness.repository.CounselingRequestRepository;
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
    private final MLPredictionService mlPredictionService;
    private final CounselingRequestRepository counselingRequestRepository;

    public AssessmentService(AssessmentQuestionRepository questionRepository,
                             AssessmentResponseRepository responseRepository,
                             StudentRepository studentRepository,
                             DepartmentRepository departmentRepository,
                             NotificationService notificationService,
                             AuditLogService auditLogService,
                             MLPredictionService mlPredictionService,
                             CounselingRequestRepository counselingRequestRepository) {
        this.questionRepository = questionRepository;
        this.responseRepository = responseRepository;
        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
        this.mlPredictionService = mlPredictionService;
        this.counselingRequestRepository = counselingRequestRepository;
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

        // 1. Initial Assessment Response Record (NO rule-based prediction!)
        AssessmentResponse response = AssessmentResponse.builder()
                .studentId(student.getId())
                .studentName(student.getName())
                .studentRegisterNo(student.getRegisterNumber())
                .departmentName(student.getDepartmentName())
                .answers(answers)
                .categoryScores(categoryScores)
                .overallScore(overallScore)
                .riskLevel(null) // STRICT: NO hardcoded or rule-based prediction!
                .summary("Processing wellness assessment through ML prediction pipeline...")
                .recommendations(Collections.emptyList())
                .createdAt(LocalDateTime.now())
                .build();

        AssessmentResponse savedResponse = responseRepository.save(response);

        // 2. Extract ML Feature Set from Assessment Dimensions
        Map<String, Object> mlFeatures = extractMLFeatures(student, answers, questions, overallScore,
                calculatedStress, calculatedAnxiety, calculatedSleep, categoryScores);

        // 3. Obtain Prediction Exclusively from Trained ML Pipeline
        MLPrediction mlPrediction = mlPredictionService.predictWellnessRisk(student.getId(), savedResponse.getId(), mlFeatures);
        savedResponse.setMlPrediction(mlPrediction);

        RiskLevel mlRisk = mlPrediction != null ? mlPrediction.getPrediction() : null;
        savedResponse.setRiskLevel(mlRisk); // ONLY ML Model determines risk!

        if (mlPrediction != null && "SUCCESS".equalsIgnoreCase(mlPrediction.getStatus()) && mlRisk != null) {
            String summary = generateWellnessSummary(overallScore, mlRisk, mlPrediction);
            List<String> recommendations = generateRecommendations(mlRisk, categoryScores);
            savedResponse.setSummary(summary);
            savedResponse.setRecommendations(recommendations);
            student.setRiskLevel(mlRisk);
        } else {
            // ML UNAVAILABLE: STRICT NO-FALLBACK RULE.
            // Do NOT guess or calculate risk manually.
            String unavailableMsg = "Your wellness assessment responses were recorded successfully. " +
                    "The automated ML screening service is temporarily offline, so no automated risk classification was assigned. " +
                    "Please consult counselor office hours for routine review.";
            savedResponse.setSummary(unavailableMsg);
            savedResponse.setRecommendations(generateRecommendations(null, categoryScores));
            log.warn("Assessment saved with ID {} but ML prediction was unavailable. Preserving state without fallback.", savedResponse.getId());
        }

        student.setCurrentWellnessScore(overallScore);
        student.setStressScore(calculatedStress);
        student.setAnxietyScore(calculatedAnxiety);
        student.setSleepScore(calculatedSleep);
        student.setLastAssessmentDate(LocalDateTime.now());
        studentRepository.save(student);

        savedResponse = responseRepository.save(savedResponse);

        updateDepartmentMetrics(student.getDepartmentId(), student.getDepartmentName());

        String riskNotice = mlRisk != null ? " (" + mlRisk + " ML Screening Risk)" : "";
        notificationService.sendNotification(
                student.getUserId(),
                "Wellness Assessment Completed",
                "Your overall wellness score is " + overallScore + "/100" + riskNotice + ". View your personalized insights.",
                NotificationType.ASSESSMENT_REMINDER,
                "/student/assessment"
        );

        if (mlRisk == RiskLevel.HIGH || mlRisk == RiskLevel.CRITICAL) {
            if (student.getAssignedCounselorId() != null) {
                notificationService.sendNotification(
                        student.getAssignedCounselorId(),
                        "ML High Risk Alert: " + student.getName(),
                        "Student " + student.getName() + " (" + student.getRegisterNumber() + ") evaluated as " + mlRisk + " risk by ML Model. Prompt review recommended.",
                        NotificationType.COUNSELOR_FOLLOW_UP,
                        "/counselor/students/" + student.getId()
                );
            }
        }

        auditLogService.log(student.getUserId(), student.getName(), Role.ROLE_STUDENT, "SUBMIT_ASSESSMENT",
                "AssessmentResponse", savedResponse.getId(),
                "Score: " + overallScore + ", ML Risk: " + (mlRisk != null ? mlRisk : "UNAVAILABLE"), null);

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

    private Map<String, Object> extractMLFeatures(Student student, Map<String, Object> answers,
                                                 List<AssessmentQuestion> questions, int overallScore,
                                                 int calculatedStress, int calculatedAnxiety,
                                                 int calculatedSleep, List<CategoryScore> categoryScores) {
        Map<String, Object> features = new HashMap<>();

        // Map category percentages or question answers to features
        double academicPressure = 5.0;
        double studyWorkload = 5.0;
        double stressLevel = Math.max(1.0, Math.min(10.0, (calculatedStress / 10.0)));
        double sleepHours = Math.max(1.0, Math.min(10.0, (calculatedSleep / 10.0)));
        double anxietyScore = (double) calculatedAnxiety;
        double depressionIndicator = 0.0;
        double socialConnectedness = 5.0;
        double physicalActivity = 3.5;
        double previousCounseling = 0.0;

        for (AssessmentQuestion q : questions) {
            Object ans = answers.get(q.getId());
            if (ans == null) continue;

            String cat = q.getCategory() != null ? q.getCategory() : "";
            if (cat.equalsIgnoreCase("Academic Pressure") && q.getType() == QuestionType.RATING_SCALE) {
                academicPressure = Math.max(1.0, Math.min(10.0, parseNumeric(ans)));
            } else if (cat.equalsIgnoreCase("Workload") && q.getType() == QuestionType.RATING_SCALE) {
                // Invert balance (1 = No free time -> 10 pressure, 10 = Great balance -> 1 pressure)
                double raw = parseNumeric(ans);
                studyWorkload = Math.max(1.0, Math.min(10.0, 11.0 - raw));
            } else if (cat.equalsIgnoreCase("Stress") && q.getType() == QuestionType.RATING_SCALE) {
                stressLevel = Math.max(1.0, Math.min(10.0, parseNumeric(ans)));
            } else if (cat.equalsIgnoreCase("Sleep") && q.getType() == QuestionType.MULTIPLE_CHOICE) {
                String val = ans.toString().toLowerCase();
                if (val.contains("less than 4")) sleepHours = 3.5;
                else if (val.contains("4 to 5")) sleepHours = 4.5;
                else if (val.contains("6 to 7")) sleepHours = 6.5;
                else if (val.contains("7 to 9")) sleepHours = 8.0;
                else if (val.contains("more than 9")) sleepHours = 9.5;
            } else if (cat.equalsIgnoreCase("Sleep") && q.getType() == QuestionType.RATING_SCALE && sleepHours == 0.0) {
                sleepHours = Math.max(1.0, Math.min(10.0, parseNumeric(ans)));
            } else if (cat.equalsIgnoreCase("Anxiety") && q.getType() == QuestionType.RATING_SCALE) {
                anxietyScore = Math.max(5.0, Math.min(95.0, parseNumeric(ans) * 9.5));
            } else if (cat.equalsIgnoreCase("Emotional Wellbeing") && q.getType() == QuestionType.FREQUENCY) {
                String val = ans.toString().toLowerCase();
                if (val.contains("at no time") || val.contains("less than half")) {
                    depressionIndicator = 1.0;
                }
            } else if (cat.equalsIgnoreCase("Social Wellbeing") && q.getType() == QuestionType.RATING_SCALE) {
                socialConnectedness = Math.max(1.0, Math.min(10.0, parseNumeric(ans)));
            } else if (cat.equalsIgnoreCase("Lifestyle") && q.getType() == QuestionType.MULTIPLE_CHOICE) {
                String val = ans.toString().toLowerCase();
                if (val.contains("0 days")) physicalActivity = 0.5;
                else if (val.contains("1-2 days")) physicalActivity = 2.0;
                else if (val.contains("3-4 days")) physicalActivity = 4.5;
                else if (val.contains("5+ days")) physicalActivity = 7.0;
            }
        }

        // Check if student has previous counseling requests or sessions
        try {
            boolean hasCounselingHistory = counselingRequestRepository.existsByStudentId(student.getId());
            if (hasCounselingHistory) {
                previousCounseling = 1.0;
            }
        } catch (Exception ex) {
            log.debug("Error checking counseling history: {}", ex.getMessage());
        }

        features.put("Academic_Pressure", Math.round(academicPressure * 10.0) / 10.0);
        features.put("Study_Workload", Math.round(studyWorkload * 10.0) / 10.0);
        features.put("Stress_Level", Math.round(stressLevel * 10.0) / 10.0);
        features.put("Sleep_Quality_Hours", Math.round(sleepHours * 10.0) / 10.0);
        features.put("Anxiety_Score", Math.round(anxietyScore * 10.0) / 10.0);
        features.put("Depression_Indicator", depressionIndicator);
        features.put("Social_Connectedness", Math.round(socialConnectedness * 10.0) / 10.0);
        features.put("Physical_Activity_Hrs", Math.round(physicalActivity * 10.0) / 10.0);
        features.put("Previous_Counseling", previousCounseling);
        features.put("Wellness_Score", (double) overallScore);

        return features;
    }

    private String generateWellnessSummary(int score, RiskLevel risk, MLPrediction prediction) {
        StringBuilder sb = new StringBuilder();
        String probStr = (prediction != null && prediction.getProbability() != null)
                ? " (Confidence: " + Math.round(prediction.getProbability() * 100) + "%)"
                : "";

        if (risk == RiskLevel.LOW) {
            sb.append("ML Risk Screening: LOW RISK").append(probStr).append(". ");
            sb.append("Your overall mental and emotional wellbeing is in a healthy, flourishing state (Score: ").append(score).append("/100). ");
            sb.append("Key indicators demonstrate resilient coping strategies and balanced lifestyle habits.");
        } else if (risk == RiskLevel.MODERATE) {
            sb.append("ML Risk Screening: MODERATE RISK").append(probStr).append(". ");
            sb.append("Your wellness evaluation indicates mild to moderate strain (Score: ").append(score).append("/100). ");
            sb.append("While your psychological baseline is steady, specific factors like academic load or sleep regularity may be causing fatigue.");
        } else if (risk == RiskLevel.HIGH) {
            sb.append("ML Risk Screening: HIGH RISK").append(probStr).append(". ");
            sb.append("Your assessment reveals elevated stress and psychological fatigue (Score: ").append(score).append("/100). ");
            sb.append("Multiple wellness dimensions show noticeable distress. Scheduling a 1-on-1 counseling session is strongly recommended.");
        } else if (risk == RiskLevel.CRITICAL) {
            sb.append("ML Risk Screening: CRITICAL RISK").append(probStr).append(". ");
            sb.append("Your score indicates critical levels of stress and burnout (Score: ").append(score).append("/100). ");
            sb.append("We strongly encourage you to connect with campus counseling and support specialists as soon as possible.");
        } else {
            sb.append("Wellness Assessment Score: ").append(score).append("/100. Comprehensive evaluation completed.");
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
