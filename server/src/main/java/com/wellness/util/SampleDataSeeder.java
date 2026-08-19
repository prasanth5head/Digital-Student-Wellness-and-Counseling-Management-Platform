package com.wellness.util;

import com.wellness.model.*;
import com.wellness.repository.*;
import com.wellness.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class SampleDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(SampleDataSeeder.class);

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CounselorRepository counselorRepository;
    private final DepartmentRepository departmentRepository;
    private final AssessmentQuestionRepository questionRepository;
    private final AssessmentResponseRepository responseRepository;
    private final CounselingRequestRepository requestRepository;
    private final AppointmentRepository appointmentRepository;
    private final CounselingSessionRepository sessionRepository;
    private final CounselorNoteRepository noteRepository;
    private final MessageRepository messageRepository;
    private final NotificationRepository notificationRepository;
    private final WellnessResourceRepository resourceRepository;
    private final AnnouncementRepository announcementRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public SampleDataSeeder(UserRepository userRepository, StudentRepository studentRepository,
                            CounselorRepository counselorRepository, DepartmentRepository departmentRepository,
                            AssessmentQuestionRepository questionRepository, AssessmentResponseRepository responseRepository,
                            CounselingRequestRepository requestRepository, AppointmentRepository appointmentRepository,
                            CounselingSessionRepository sessionRepository, CounselorNoteRepository noteRepository,
                            MessageRepository messageRepository, NotificationRepository notificationRepository,
                            WellnessResourceRepository resourceRepository, AnnouncementRepository announcementRepository,
                            AuditLogRepository auditLogRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.counselorRepository = counselorRepository;
        this.departmentRepository = departmentRepository;
        this.questionRepository = questionRepository;
        this.responseRepository = responseRepository;
        this.requestRepository = requestRepository;
        this.appointmentRepository = appointmentRepository;
        this.sessionRepository = sessionRepository;
        this.noteRepository = noteRepository;
        this.messageRepository = messageRepository;
        this.notificationRepository = notificationRepository;
        this.resourceRepository = resourceRepository;
        this.announcementRepository = announcementRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains data. Skipping initial seeding.");
            return;
        }

        log.info("Starting comprehensive realistic database seeding for AuraWell platform...");

        // 1. Seed Admin
        User adminUser = User.builder()
                .email("admin@wellness.edu")
                .password(passwordEncoder.encode("Admin@123"))
                .name("Campus Wellness Administrator")
                .role(Role.ROLE_ADMIN)
                .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=AdminHealth")
                .active(true)
                .createdAt(LocalDateTime.now().minusMonths(6))
                .build();
        userRepository.save(adminUser);

        // 2. Seed Departments
        Department cse = Department.builder()
                .code("CSE")
                .name("Computer Science & Engineering")
                .headOfDepartment("Dr. Alan Turing")
                .description("Department of Computer Science, AI, and Software Systems")
                .studentCount(8)
                .averageWellnessScore(72.5)
                .highRiskCount(2)
                .activeCounselingRequests(4)
                .completedSessions(12)
                .build();

        Department ece = Department.builder()
                .code("ECE")
                .name("Electronics & Communication")
                .headOfDepartment("Dr. Claude Shannon")
                .description("Department of Electronics, IoT, and Embedded Computing")
                .studentCount(6)
                .averageWellnessScore(76.8)
                .highRiskCount(1)
                .activeCounselingRequests(2)
                .completedSessions(9)
                .build();

        Department mba = Department.builder()
                .code("MBA")
                .name("School of Business & Management")
                .headOfDepartment("Dr. Peter Drucker")
                .description("Department of Management, Finance, and Strategic Leadership")
                .studentCount(6)
                .averageWellnessScore(80.2)
                .highRiskCount(1)
                .activeCounselingRequests(3)
                .completedSessions(10)
                .build();

        departmentRepository.saveAll(List.of(cse, ece, mba));

        // 3. Seed 5 Counselors
        List<Counselor> counselorList = new ArrayList<>();

        String[][] counselorData = {
                {"Sarah Jenkins", "counselor.sarah@wellness.edu", "Cognitive Behavioral Therapy & Academic Stress", "Ph.D. Clinical Psychology, Licensed CBT Specialist", "8", "Student Wellness Hub, Room 201"},
                {"Marcus Vance", "counselor.marcus@wellness.edu", "Crisis Intervention & Panic Management", "M.Sc. Counseling Psychology, Crisis Response Cert.", "6", "Student Wellness Hub, Room 204"},
                {"Priya Sharma", "counselor.priya@wellness.edu", "Mindfulness, Sleep Hygiene & Emotional Wellness", "M.Phil. Psychology, Certified Mindfulness Coach", "5", "Mind-Body Center, Room 102"},
                {"David Chen", "counselor.david@wellness.edu", "Career Anxiety & Academic Performance", "Ed.D. Higher Ed Counseling, Career Strategist", "10", "Career & Wellness Wing, Room 305"},
                {"Elena Rostova", "counselor.elena@wellness.edu", "Social Connection & Interpersonal Counseling", "M.S. Clinical Mental Health Counseling", "4", "Student Life Center, Room 110"}
        };

        for (String[] c : counselorData) {
            User cUser = User.builder()
                    .email(c[1])
                    .password(passwordEncoder.encode("Counselor@123"))
                    .name("Dr. " + c[0])
                    .role(Role.ROLE_COUNSELOR)
                    .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=" + c[0].replaceAll("\\s+", ""))
                    .active(true)
                    .createdAt(LocalDateTime.now().minusMonths(4))
                    .build();
            userRepository.save(cUser);

            Counselor counselor = Counselor.builder()
                    .userId(cUser.getId())
                    .name(cUser.getName())
                    .email(cUser.getEmail())
                    .avatar(cUser.getAvatar())
                    .specialization(c[2])
                    .qualifications(c[3])
                    .experienceYears(Integer.parseInt(c[4]))
                    .availableDays(List.of("Monday", "Tuesday", "Wednesday", "Thursday", "Friday"))
                    .availableSlots(List.of("09:00 - 10:00", "10:30 - 11:30", "13:30 - 14:30", "15:00 - 16:00"))
                    .officeLocation(c[5])
                    .contactNumber("+1 (555) 234-890" + (counselorList.size() + 1))
                    .bio("Dedicated mental health professional providing empathetic, evidence-based counseling support to empower university students.")
                    .active(true)
                    .activeStudentCount(4)
                    .totalSessionsConducted(18 + counselorList.size() * 5)
                    .rating(4.85)
                    .build();

            counselorList.add(counselorRepository.save(counselor));
        }

        // 4. Seed 24 Assessment Questions
        List<AssessmentQuestion> questions = List.of(
                AssessmentQuestion.builder().category("Stress").questionText("How would you rate your overall stress level over the past 2 weeks?").type(QuestionType.RATING_SCALE).minRating(1).maxRating(10).minLabel("Very Calm").maxLabel("Extreme Stress").order(1).build(),
                AssessmentQuestion.builder().category("Stress").questionText("How often do you feel unable to cope with the demands placed on you?").type(QuestionType.FREQUENCY).options(List.of(new QuestionOption("Never", 10), new QuestionOption("Rarely", 8), new QuestionOption("Sometimes", 5), new QuestionOption("Often", 2), new QuestionOption("Almost Always", 0))).order(2).build(),
                AssessmentQuestion.builder().category("Stress").questionText("Do you experience physical stress symptoms like muscle tension or tension headaches?").type(QuestionType.YES_NO).order(3).build(),

                AssessmentQuestion.builder().category("Anxiety").questionText("How often do you experience sudden feelings of nervousness, panic, or dread?").type(QuestionType.FREQUENCY).options(List.of(new QuestionOption("Not at all", 10), new QuestionOption("Several days", 7), new QuestionOption("More than half the days", 4), new QuestionOption("Nearly every day", 1))).order(4).build(),
                AssessmentQuestion.builder().category("Anxiety").questionText("Rate the intensity of racing thoughts or constant worrying:").type(QuestionType.RATING_SCALE).minRating(1).maxRating(10).minLabel("Minimal / None").maxLabel("Overwhelming").order(5).build(),
                AssessmentQuestion.builder().category("Anxiety").questionText("Do worry or anxious feelings prevent you from speaking up or attending classes?").type(QuestionType.YES_NO).order(6).build(),

                AssessmentQuestion.builder().category("Sleep").questionText("How would you rate the overall restorative quality of your sleep?").type(QuestionType.RATING_SCALE).minRating(1).maxRating(10).minLabel("Very Poor / Insomnia").maxLabel("Excellent / Refreshed").order(7).build(),
                AssessmentQuestion.builder().category("Sleep").questionText("On average, how many hours of sleep do you get per night?").type(QuestionType.MULTIPLE_CHOICE).options(List.of(new QuestionOption("Less than 4 hours", 1), new QuestionOption("4 to 5 hours", 4), new QuestionOption("6 to 7 hours", 8), new QuestionOption("7 to 9 hours", 10), new QuestionOption("More than 9 hours", 7))).order(8).build(),
                AssessmentQuestion.builder().category("Sleep").questionText("How frequently do you wake up feeling fatigued or unrefreshed?").type(QuestionType.FREQUENCY).options(List.of(new QuestionOption("Never", 10), new QuestionOption("1-2 days/week", 7), new QuestionOption("3-5 days/week", 4), new QuestionOption("Daily", 1))).order(9).build(),

                AssessmentQuestion.builder().category("Academic Pressure").questionText("How overwhelmed do you feel by upcoming exams, assignments, or project deadlines?").type(QuestionType.RATING_SCALE).minRating(1).maxRating(10).minLabel("Completely in Control").maxLabel("Extremely Overwhelmed").order(10).build(),
                AssessmentQuestion.builder().category("Academic Pressure").questionText("Do you find yourself procrastinating due to fear of failure or perfectionism?").type(QuestionType.FREQUENCY).options(List.of(new QuestionOption("Rarely", 10), new QuestionOption("Occasionally", 7), new QuestionOption("Frequently", 3), new QuestionOption("Constantly", 1))).order(11).build(),
                AssessmentQuestion.builder().category("Academic Pressure").questionText("Do you feel you have access to sufficient academic tutoring and guidance?").type(QuestionType.YES_NO).order(12).build(),

                AssessmentQuestion.builder().category("Social Wellbeing").questionText("Rate your sense of belonging and connectedness on campus:").type(QuestionType.RATING_SCALE).minRating(1).maxRating(10).minLabel("Isolated / Disconnected").maxLabel("Deeply Connected").order(13).build(),
                AssessmentQuestion.builder().category("Social Wellbeing").questionText("Do you have at least one trusted friend or mentor you can confide in when stressed?").type(QuestionType.YES_NO).order(14).build(),
                AssessmentQuestion.builder().category("Social Wellbeing").questionText("How often do you participate in social activities, clubs, or peer meetups?").type(QuestionType.FREQUENCY).options(List.of(new QuestionOption("Multiple times a week", 10), new QuestionOption("Once a week", 8), new QuestionOption("Once a month", 5), new QuestionOption("Rarely / Never", 2))).order(15).build(),

                AssessmentQuestion.builder().category("Emotional Wellbeing").questionText("How often have you felt cheerful, motivated, and in good spirits lately?").type(QuestionType.FREQUENCY).options(List.of(new QuestionOption("Most of the time", 10), new QuestionOption("More than half the time", 8), new QuestionOption("Less than half the time", 4), new QuestionOption("At no time", 1))).order(16).build(),
                AssessmentQuestion.builder().category("Emotional Wellbeing").questionText("Rate your current level of emotional resilience when faced with sudden obstacles:").type(QuestionType.RATING_SCALE).minRating(1).maxRating(10).minLabel("Easily Overwhelmed").maxLabel("Highly Resilient").order(17).build(),
                AssessmentQuestion.builder().category("Emotional Wellbeing").questionText("Do you engage in regular creative hobbies or mindfulness to decompress?").type(QuestionType.YES_NO).order(18).build(),

                AssessmentQuestion.builder().category("Workload").questionText("Rate the balance between your study hours and personal leisure time:").type(QuestionType.RATING_SCALE).minRating(1).maxRating(10).minLabel("No Free Time").maxLabel("Great Balance").order(19).build(),
                AssessmentQuestion.builder().category("Workload").questionText("How often do you skip meals or sleep due to heavy course work?").type(QuestionType.FREQUENCY).options(List.of(new QuestionOption("Never", 10), new QuestionOption("Occasionally", 7), new QuestionOption("Frequently", 3), new QuestionOption("Almost Daily", 1))).order(20).build(),
                AssessmentQuestion.builder().category("Workload").questionText("Do you utilize a calendar or time-blocking planner for coursework?").type(QuestionType.YES_NO).order(21).build(),

                AssessmentQuestion.builder().category("Lifestyle").questionText("How many days per week do you get at least 20 minutes of moderate exercise?").type(QuestionType.MULTIPLE_CHOICE).options(List.of(new QuestionOption("0 days", 2), new QuestionOption("1-2 days", 5), new QuestionOption("3-4 days", 8), new QuestionOption("5+ days", 10))).order(22).build(),
                AssessmentQuestion.builder().category("Lifestyle").questionText("How would you rate your daily nutritional and hydration habits?").type(QuestionType.RATING_SCALE).minRating(1).maxRating(10).minLabel("Unhealthy / Irregular").maxLabel("Balanced & Nourishing").order(23).build(),
                AssessmentQuestion.builder().category("Lifestyle").questionText("How many cups of caffeinated drinks (coffee, energy drinks) do you consume daily?").type(QuestionType.MULTIPLE_CHOICE).options(List.of(new QuestionOption("0-1 cups", 10), new QuestionOption("2-3 cups", 7), new QuestionOption("4-5 cups", 4), new QuestionOption("6+ cups", 1))).order(24).build()
        );

        questionRepository.saveAll(questions);

        // 5. Seed 20 Students
        String[][] studentsData = {
                {"Alex Morgan", "student.alex@wellness.edu", "REG2024001", "CSE", "3", "84", "22", "18", "82", "LOW"},
                {"Jordan Lee", "student.jordan@wellness.edu", "REG2024002", "ECE", "2", "54", "65", "58", "48", "HIGH"},
                {"Sam Taylor", "student.sam@wellness.edu", "REG2024003", "MBA", "1", "68", "42", "38", "65", "MODERATE"},
                {"Maya Patel", "student.maya@wellness.edu", "REG2024004", "CSE", "4", "38", "82", "78", "32", "CRITICAL"},
                {"Liam Wilson", "student.liam@wellness.edu", "REG2024005", "ECE", "3", "78", "28", "24", "76", "LOW"},
                {"Sophia Chen", "student.sophia@wellness.edu", "REG2024006", "MBA", "2", "88", "16", "14", "88", "LOW"},
                {"Noah Miller", "student.noah@wellness.edu", "REG2024007", "CSE", "2", "62", "48", "45", "58", "MODERATE"},
                {"Emma Davis", "student.emma@wellness.edu", "REG2024008", "ECE", "4", "48", "72", "68", "42", "HIGH"},
                {"Ethan Clark", "student.ethan@wellness.edu", "REG2024009", "MBA", "1", "76", "30", "28", "74", "LOW"},
                {"Olivia Brown", "student.olivia@wellness.edu", "REG2024010", "CSE", "1", "81", "24", "20", "80", "LOW"},
                {"Lucas Garcia", "student.lucas@wellness.edu", "REG2024011", "ECE", "3", "59", "55", "50", "45", "HIGH"},
                {"Ava Martinez", "student.ava@wellness.edu", "REG2024012", "MBA", "2", "92", "12", "10", "90", "LOW"},
                {"Benjamin Taylor", "student.benjamin@wellness.edu", "REG2024013", "CSE", "2", "70", "38", "35", "68", "MODERATE"},
                {"Isabella White", "student.isabella@wellness.edu", "REG2024014", "ECE", "1", "64", "45", "40", "62", "MODERATE"},
                {"William Harris", "student.william@wellness.edu", "REG2024015", "MBA", "3", "83", "20", "18", "82", "LOW"},
                {"Mia Robinson", "student.mia@wellness.edu", "REG2024016", "CSE", "3", "77", "26", "22", "75", "LOW"},
                {"James Walker", "student.james@wellness.edu", "REG2024017", "ECE", "2", "42", "78", "75", "35", "CRITICAL"},
                {"Charlotte Hall", "student.charlotte@wellness.edu", "REG2024018", "MBA", "1", "85", "18", "16", "84", "LOW"},
                {"Daniel Allen", "student.daniel@wellness.edu", "REG2024019", "CSE", "4", "66", "44", "40", "64", "MODERATE"},
                {"Amelia Young", "student.amelia@wellness.edu", "REG2024020", "ECE", "3", "79", "25", "22", "78", "LOW"}
        };

        List<Student> seededStudents = new ArrayList<>();

        for (int i = 0; i < studentsData.length; i++) {
            String[] s = studentsData[i];
            User sUser = User.builder()
                    .email(s[1])
                    .password(passwordEncoder.encode("Student@123"))
                    .name(s[0])
                    .role(Role.ROLE_STUDENT)
                    .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=" + s[0].replaceAll("\\s+", ""))
                    .active(true)
                    .createdAt(LocalDateTime.now().minusMonths(3))
                    .build();
            userRepository.save(sUser);

            Department d = s[3].equalsIgnoreCase("CSE") ? cse : s[3].equalsIgnoreCase("ECE") ? ece : mba;
            Counselor assignedC = counselorList.get(i % counselorList.size());

            Student student = Student.builder()
                    .userId(sUser.getId())
                    .name(sUser.getName())
                    .email(sUser.getEmail())
                    .avatar(sUser.getAvatar())
                    .registerNumber(s[2])
                    .departmentId(d.getId())
                    .departmentName(d.getName())
                    .yearOfStudy(Integer.parseInt(s[4]))
                    .currentWellnessScore(Integer.parseInt(s[5]))
                    .stressScore(Integer.parseInt(s[6]))
                    .anxietyScore(Integer.parseInt(s[7]))
                    .sleepScore(Integer.parseInt(s[8]))
                    .riskLevel(RiskLevel.valueOf(s[9]))
                    .assignedCounselorId(assignedC.getId())
                    .assignedCounselorName(assignedC.getName())
                    .contactNumber("+1 (555) 987-10" + String.format("%02d", i + 1))
                    .emergencyContact("Parent/Guardian: +1 (555) 345-67" + String.format("%02d", i + 1))
                    .bio("Dedicated " + d.getCode() + " student striving for healthy academic excellence and mindfulness.")
                    .lastAssessmentDate(LocalDateTime.now().minusDays(i % 10 + 1))
                    .createdAt(LocalDateTime.now().minusMonths(3))
                    .build();

            seededStudents.add(studentRepository.save(student));
        }

        // 6. Seed Historical Assessments for Alex Morgan
        Student alex = seededStudents.get(0);
        int[] alexScores = {72, 68, 75, 81, 84};
        for (int k = 0; k < alexScores.length; k++) {
            int score = alexScores[k];
            AssessmentResponse ar = AssessmentResponse.builder()
                    .studentId(alex.getId())
                    .studentName(alex.getName())
                    .studentRegisterNo(alex.getRegisterNumber())
                    .departmentName(alex.getDepartmentName())
                    .overallScore(score)
                    .riskLevel(score >= 75 ? RiskLevel.LOW : RiskLevel.MODERATE)
                    .summary("Assessment milestone " + (k + 1) + ": Overall mental wellness shows continuous upward trajectory.")
                    .categoryScores(List.of(
                            CategoryScore.builder().category("Stress").percentage(score - 4).riskLevel(RiskLevel.LOW).statusDescription("Healthy").build(),
                            CategoryScore.builder().category("Sleep").percentage(score + 2).riskLevel(RiskLevel.LOW).statusDescription("Restorative").build(),
                            CategoryScore.builder().category("Anxiety").percentage(score - 6).riskLevel(RiskLevel.LOW).statusDescription("Calm").build(),
                            CategoryScore.builder().category("Academic Pressure").percentage(score).riskLevel(RiskLevel.LOW).statusDescription("Manageable").build(),
                            CategoryScore.builder().category("Social Wellbeing").percentage(85).riskLevel(RiskLevel.LOW).statusDescription("Connected").build()
                    ))
                    .recommendations(List.of("Continue mindful morning walks", "Maintain Pomodoro work blocks"))
                    .createdAt(LocalDateTime.now().minusDays((alexScores.length - k) * 7))
                    .build();
            responseRepository.save(ar);
        }

        // 7. Seed Counseling Requests
        CounselingRequest req1 = CounselingRequest.builder()
                .studentId(seededStudents.get(1).getId())
                .studentName(seededStudents.get(1).getName())
                .studentRegisterNo(seededStudents.get(1).getRegisterNumber())
                .studentEmail(seededStudents.get(1).getEmail())
                .departmentName(seededStudents.get(1).getDepartmentName())
                .preferredCounselorId(counselorList.get(0).getId())
                .preferredCounselorName(counselorList.get(0).getName())
                .requestType("Anxiety & Panic Management")
                .preferredDate(LocalDate.now().plusDays(2))
                .preferredTimeSlot("10:30 - 11:30")
                .reason("Experiencing recurring sleep disruptions and panic symptoms before upcoming midterms.")
                .urgency(UrgencyLevel.HIGH)
                .additionalNotes("Prefer video consultation if possible.")
                .status(RequestStatus.PENDING)
                .createdAt(LocalDateTime.now().minusHours(4))
                .build();

        CounselingRequest req2 = CounselingRequest.builder()
                .studentId(seededStudents.get(3).getId())
                .studentName(seededStudents.get(3).getName())
                .studentRegisterNo(seededStudents.get(3).getRegisterNumber())
                .studentEmail(seededStudents.get(3).getEmail())
                .departmentName(seededStudents.get(3).getDepartmentName())
                .preferredCounselorId(counselorList.get(1).getId())
                .preferredCounselorName(counselorList.get(1).getName())
                .requestType("Academic Burnout & Crisis Support")
                .preferredDate(LocalDate.now().plusDays(1))
                .preferredTimeSlot("09:00 - 10:00")
                .reason("Severe burnout, unable to concentrate on senior capstone project.")
                .urgency(UrgencyLevel.EMERGENCY)
                .status(RequestStatus.ACCEPTED)
                .counselorResponseNotes("Immediate intake slot scheduled for tomorrow morning.")
                .createdAt(LocalDateTime.now().minusDays(1))
                .build();

        CounselingRequest req3 = CounselingRequest.builder()
                .studentId(alex.getId())
                .studentName(alex.getName())
                .studentRegisterNo(alex.getRegisterNumber())
                .studentEmail(alex.getEmail())
                .departmentName(alex.getDepartmentName())
                .preferredCounselorId(counselorList.get(0).getId())
                .preferredCounselorName(counselorList.get(0).getName())
                .requestType("Routine Mindfulness Check-in")
                .preferredDate(LocalDate.now().plusDays(3))
                .preferredTimeSlot("14:00 - 15:00")
                .reason("Follow-up on sleep optimization techniques.")
                .urgency(UrgencyLevel.LOW)
                .status(RequestStatus.SCHEDULED)
                .createdAt(LocalDateTime.now().minusDays(3))
                .build();

        requestRepository.saveAll(List.of(req1, req2, req3));

        // 8. Seed Appointments & Sessions
        Appointment appUpcoming = Appointment.builder()
                .studentId(alex.getId())
                .studentName(alex.getName())
                .studentRegisterNo(alex.getRegisterNumber())
                .studentEmail(alex.getEmail())
                .studentDepartment(alex.getDepartmentName())
                .counselorId(counselorList.get(0).getId())
                .counselorName(counselorList.get(0).getName())
                .counselorEmail(counselorList.get(0).getEmail())
                .appointmentDate(LocalDate.now().plusDays(2))
                .startTime("10:30 AM")
                .endTime("11:30 AM")
                .mode(AppointmentMode.ONLINE)
                .meetingLink("https://meet.aurawell.edu/session-alex-cbt")
                .status(AppointmentStatus.CONFIRMED)
                .purpose("Follow-up on CBT cognitive reframing exercises")
                .createdAt(LocalDateTime.now().minusDays(1))
                .build();

        Appointment appCompleted = Appointment.builder()
                .studentId(alex.getId())
                .studentName(alex.getName())
                .studentRegisterNo(alex.getRegisterNumber())
                .studentEmail(alex.getEmail())
                .studentDepartment(alex.getDepartmentName())
                .counselorId(counselorList.get(0).getId())
                .counselorName(counselorList.get(0).getName())
                .counselorEmail(counselorList.get(0).getEmail())
                .appointmentDate(LocalDate.now().minusWeeks(1))
                .startTime("02:00 PM")
                .endTime("03:00 PM")
                .mode(AppointmentMode.IN_PERSON)
                .location("Student Wellness Hub, Room 201")
                .status(AppointmentStatus.COMPLETED)
                .purpose("Initial Wellness Check-in & Sleep Hygiene Discussion")
                .createdAt(LocalDateTime.now().minusWeeks(2))
                .build();

        Appointment savedCompletedApp = appointmentRepository.save(appCompleted);
        appointmentRepository.save(appUpcoming);

        // 9. Seed Counseling Session & Confidential Counselor Note
        CounselingSession session1 = CounselingSession.builder()
                .appointmentId(savedCompletedApp.getId())
                .studentId(alex.getId())
                .studentName(alex.getName())
                .studentRegisterNo(alex.getRegisterNumber())
                .counselorId(counselorList.get(0).getId())
                .counselorName(counselorList.get(0).getName())
                .sessionDate(LocalDate.now().minusWeeks(1))
                .durationMinutes(50)
                .sessionType("Cognitive Behavioral Assessment")
                .sessionSummary("Explored cognitive reframing techniques to manage project deadline pressures. Reviewed sleep routines.")
                .keyTakeaways("Focus on separating uncontrollable external variables from immediate actionable tasks.")
                .studentActionItems(List.of("Apply 10-minute digital sunset before sleep", "Maintain daily study checklist"))
                .nextFollowUpDate(LocalDate.now().plusDays(2))
                .createdAt(LocalDateTime.now().minusWeeks(1))
                .build();

        CounselingSession savedSession = sessionRepository.save(session1);
        savedCompletedApp.setSessionId(savedSession.getId());
        appointmentRepository.save(savedCompletedApp);

        CounselorNote note1 = CounselorNote.builder()
                .studentId(alex.getId())
                .counselorId(counselorList.get(0).getId())
                .counselorName(counselorList.get(0).getName())
                .sessionId(savedSession.getId())
                .title("Clinical Impression & Mental Status Exam")
                .privateNotes("Client is articulate, well-oriented, and shows strong insight into stress triggers. Sleep latency is elevated due to screen exposure. No depressive ideation or safety concerns present.")
                .clinicalRiskRating(RiskLevel.LOW)
                .mentalStatusObservations("Affect congruent, speech coherent, receptive to cognitive behavioral interventions.")
                .interventionPlan("Continue thought-record diary; re-evaluate sleep latency in 2 weeks.")
                .isConfidential(true)
                .createdAt(LocalDateTime.now().minusWeeks(1))
                .build();

        noteRepository.save(note1);

        // 10. Seed Chat Messages
        String convId = ChatService.generateConversationId(alex.getUserId(), counselorList.get(0).getUserId());
        Message m1 = Message.builder()
                .conversationId(convId)
                .senderId(alex.getUserId())
                .senderName(alex.getName())
                .senderRole(Role.ROLE_STUDENT)
                .recipientId(counselorList.get(0).getUserId())
                .recipientName(counselorList.get(0).getName())
                .content("Hello Dr. Jenkins! I practiced the breathing exercises we discussed, and my sleep has been much better this week.")
                .isRead(true)
                .timestamp(LocalDateTime.now().minusDays(2))
                .build();

        Message m2 = Message.builder()
                .conversationId(convId)
                .senderId(counselorList.get(0).getUserId())
                .senderName(counselorList.get(0).getName())
                .senderRole(Role.ROLE_COUNSELOR)
                .recipientId(alex.getUserId())
                .recipientName(alex.getName())
                .content("That is fantastic news, Alex! Looking forward to reviewing your sleep log during our session this week. Keep up the great consistency!")
                .isRead(true)
                .timestamp(LocalDateTime.now().minusDays(1))
                .build();

        messageRepository.saveAll(List.of(m1, m2));

        // 11. Seed Notifications
        Notification n1 = Notification.builder()
                .recipientId(alex.getUserId())
                .title("Upcoming Counseling Appointment")
                .message("Your appointment with Dr. Sarah Jenkins is scheduled for " + appUpcoming.getAppointmentDate() + " at " + appUpcoming.getStartTime())
                .type(NotificationType.APPOINTMENT_CONFIRMED)
                .link("/student/appointments")
                .isRead(false)
                .createdAt(LocalDateTime.now().minusHours(2))
                .build();

        Notification n2 = Notification.builder()
                .recipientId(alex.getUserId())
                .title("Weekly Wellness Check-in Ready")
                .message("Take your 3-minute wellness assessment to update your wellness index.")
                .type(NotificationType.ASSESSMENT_REMINDER)
                .link("/student/assessment")
                .isRead(true)
                .createdAt(LocalDateTime.now().minusDays(1))
                .build();

        notificationRepository.saveAll(List.of(n1, n2));

        // 12. Seed Curated Wellness Resources
        List<WellnessResource> resources = List.of(
                WellnessResource.builder()
                        .title("Mastering Exam Anxiety with Cognitive Behavioral Tools")
                        .category("Stress Management")
                        .description("Proven CBT cognitive restructuring methods to neutralize test anxiety and maintain peak mental clarity.")
                        .author("Dr. Sarah Jenkins")
                        .imageUrl("https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80")
                        .videoUrl("https://www.youtube.com/watch?v=inpok4MKVLM")
                        .tags(List.of("CBT", "Exam Stress", "Anxiety", "Mental Focus"))
                        .readTime("6 min read")
                        .contentMarkdown("### Cognitive Restructuring for Academic Stress\n\nWhen we face high-stakes exams, our automatic thoughts often default to catastrophizing. Learn how to write a quick Thought Record...")
                        .featured(true)
                        .bookmarkCount(42)
                        .build(),

                WellnessResource.builder()
                        .title("The Science of Deep Rest: Optimizing Circadian Sleep")
                        .category("Sleep")
                        .description("Understand sleep cycles, non-REM restorative sleep, and how digital curfews dramatically boost memory retention.")
                        .author("Dr. Matthew Walker Research Summary")
                        .imageUrl("https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80")
                        .videoUrl("https://www.youtube.com/watch?v=5MuIMqhT8DM")
                        .tags(List.of("Sleep Hygiene", "Circadian Rhythm", "Recovery", "Energy"))
                        .readTime("8 min read")
                        .contentMarkdown("### Why College Students Need 7.5+ Hours\n\nDuring Slow-Wave Sleep, the brain's glymphatic system clears out metabolic debris while consolidating synaptic connections...")
                        .featured(true)
                        .bookmarkCount(38)
                        .build(),

                WellnessResource.builder()
                        .title("Guided 10-Minute Body Scan Meditation")
                        .category("Meditation")
                        .description("An immersive, audio-guided mindfulness meditation to systematically release somatic tension and calm racing thoughts.")
                        .author("Ms. Priya Sharma")
                        .imageUrl("https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80")
                        .videoUrl("https://www.youtube.com/watch?v=u4gZgnCy5ew")
                        .tags(List.of("Mindfulness", "Audio Guide", "Relaxation", "Stress Relief"))
                        .readTime("10 min practice")
                        .contentMarkdown("### Instructions for Body Scan Practice\n\nFind a comfortable seated or reclining posture. Gently close your eyes and bring awareness to your breath...")
                        .featured(true)
                        .bookmarkCount(56)
                        .build(),

                WellnessResource.builder()
                        .title("Overcoming Procrastination: The 5-Minute Momentum Rule")
                        .category("Academic Pressure")
                        .description("Break free from paralyzing perfectionism using behavioral activation and structured time-boxing.")
                        .author("Dr. David Chen")
                        .imageUrl("https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80")
                        .tags(List.of("Time Management", "Procrastination", "Productivity", "Habits"))
                        .readTime("5 min read")
                        .contentMarkdown("### Behavioral Activation Strategy\n\nThe emotional barrier to starting a difficult assignment is highest in the first 120 seconds...")
                        .featured(false)
                        .bookmarkCount(29)
                        .build(),

                WellnessResource.builder()
                        .title("Building Social Resilience & Campus Connections")
                        .category("Social Wellness")
                        .description("Practical guide to overcoming social hesitation, navigating group projects, and cultivating meaningful peer support.")
                        .author("Dr. Elena Rostova")
                        .imageUrl("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80")
                        .tags(List.of("Social Wellbeing", "Friendships", "Community", "Communication"))
                        .readTime("7 min read")
                        .contentMarkdown("### Navigating Social Spaces with Confidence\n\nMeaningful friendships act as a primary psychological buffer against stress...")
                        .featured(false)
                        .bookmarkCount(21)
                        .build(),

                WellnessResource.builder()
                        .title("Desk Stretches & Posture Reset for Long Study Hours")
                        .category("Exercise")
                        .description("Simple, highly effective physical stretches you can perform right in the library or dormitory.")
                        .author("Campus Physical Health Center")
                        .imageUrl("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80")
                        .tags(List.of("Physical Health", "Ergonomics", "Stretching", "Energy"))
                        .readTime("4 min read")
                        .contentMarkdown("### Upper Back, Neck & Wrist Decompression Routine\n\nPerform these 4 stretches after every 60 minutes of laptop use...")
                        .featured(false)
                        .bookmarkCount(19)
                        .build()
        );

        resourceRepository.saveAll(resources);

        // 13. Seed Campus Announcements
        Announcement ann1 = Announcement.builder()
                .title("Campus Wellness Week: Free Mindfulness & Yoga Workshops")
                .content("Join us at the Student Center from August 22-26 for daily stress-relief workshops, puppy therapy, and healthy nutrition booths.")
                .priority("HIGH")
                .targetRole("ALL")
                .authorName("Campus Wellness Administrator")
                .active(true)
                .createdAt(LocalDateTime.now().minusDays(3))
                .build();

        Announcement ann2 = Announcement.builder()
                .title("24/7 Crisis Support Line Reminder")
                .content("If you or a peer need immediate urgent counseling support, the campus crisis helpline is accessible 24/7 at 1-800-AURAWELL.")
                .priority("URGENT")
                .targetRole("ALL")
                .authorName("Dr. Marcus Vance")
                .active(true)
                .createdAt(LocalDateTime.now().minusWeeks(1))
                .build();

        announcementRepository.saveAll(List.of(ann1, ann2));

        // 14. Seed Sample Audit Logs
        auditLogRepository.save(AuditLog.builder()
                .userId(adminUser.getId())
                .userName(adminUser.getName())
                .role(Role.ROLE_ADMIN)
                .action("SYSTEM_INIT")
                .resourceType("Platform")
                .resourceId("SYSTEM")
                .details("System seed data initialized successfully")
                .ipAddress("127.0.0.1")
                .timestamp(LocalDateTime.now().minusDays(10))
                .build());

        log.info("Realistic database seeding completed successfully! Seeded: 1 Admin, 3 Departments, 5 Counselors, 20 Students, 24 Questions, Appointments, Sessions, Notes, Messages, Resources & Announcements.");
    }
}
