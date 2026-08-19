package com.wellness.service;

import com.wellness.dto.*;
import com.wellness.exception.BadRequestException;
import com.wellness.exception.ConflictException;
import com.wellness.exception.ResourceNotFoundException;
import com.wellness.model.*;
import com.wellness.repository.CounselorRepository;
import com.wellness.repository.DepartmentRepository;
import com.wellness.repository.StudentRepository;
import com.wellness.repository.UserRepository;
import com.wellness.security.JwtUtil;
import com.wellness.security.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CounselorRepository counselorRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final AuditLogService auditLogService;

    public AuthService(UserRepository userRepository, StudentRepository studentRepository,
                       CounselorRepository counselorRepository, DepartmentRepository departmentRepository,
                       PasswordEncoder passwordEncoder, JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager, AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.counselorRepository = counselorRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.auditLogService = auditLogService;
    }

    public AuthResponse login(AuthRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserDTO userDTO = mapToUserDTO(user);
        StudentDTO studentDTO = null;
        CounselorDTO counselorDTO = null;

        if (user.getRole() == Role.ROLE_STUDENT) {
            Student student = studentRepository.findByUserId(user.getId())
                    .orElse(null);
            if (student != null) {
                studentDTO = mapToStudentDTO(student);
            }
        } else if (user.getRole() == Role.ROLE_COUNSELOR) {
            Counselor counselor = counselorRepository.findByUserId(user.getId())
                    .orElse(null);
            if (counselor != null) {
                counselorDTO = mapToCounselorDTO(counselor);
            }
        }

        auditLogService.log(user.getId(), user.getName(), user.getRole(), "USER_LOGIN", "User", user.getId(), "User logged in successfully", null);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(userDTO)
                .student(studentDTO)
                .counselor(counselorDTO)
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email is already registered: " + email);
        }

        if (request.getRole() == Role.ROLE_STUDENT) {
            if (request.getRegisterNumber() == null || request.getRegisterNumber().isBlank()) {
                throw new BadRequestException("Register number is required for students");
            }
            if (studentRepository.existsByRegisterNumber(request.getRegisterNumber().trim())) {
                throw new ConflictException("Register number is already registered: " + request.getRegisterNumber());
            }
        }

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName().trim())
                .role(request.getRole())
                .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=" + request.getName().replaceAll("\\s+", ""))
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        StudentDTO studentDTO = null;
        CounselorDTO counselorDTO = null;

        if (user.getRole() == Role.ROLE_STUDENT) {
            String deptName = request.getDepartmentName();
            if (deptName == null && request.getDepartmentId() != null) {
                departmentRepository.findById(request.getDepartmentId())
                        .ifPresent(d -> {});
            }

            Student student = Student.builder()
                    .userId(savedUser.getId())
                    .name(savedUser.getName())
                    .email(savedUser.getEmail())
                    .avatar(savedUser.getAvatar())
                    .registerNumber(request.getRegisterNumber().trim().toUpperCase())
                    .departmentId(request.getDepartmentId())
                    .departmentName(deptName != null ? deptName : "Computer Science & Engineering")
                    .yearOfStudy(request.getYearOfStudy() > 0 ? request.getYearOfStudy() : 1)
                    .currentWellnessScore(null)
                    .stressScore(null)
                    .anxietyScore(null)
                    .sleepScore(null)
                    .riskLevel(null)
                    .contactNumber(request.getContactNumber())
                    .emergencyContact(request.getEmergencyContact())
                    .bio(request.getBio())
                    .createdAt(LocalDateTime.now())
                    .build();

            Student savedStudent = studentRepository.save(student);
            studentDTO = mapToStudentDTO(savedStudent);

            if (request.getDepartmentId() != null) {
                departmentRepository.findById(request.getDepartmentId()).ifPresent(d -> {
                    d.setStudentCount(d.getStudentCount() + 1);
                    departmentRepository.save(d);
                });
            }

        } else if (user.getRole() == Role.ROLE_COUNSELOR) {
            Counselor counselor = Counselor.builder()
                    .userId(savedUser.getId())
                    .name(savedUser.getName())
                    .email(savedUser.getEmail())
                    .avatar(savedUser.getAvatar())
                    .specialization(request.getSpecialization() != null ? request.getSpecialization() : "General Student Counseling & Stress Management")
                    .qualifications(request.getQualifications() != null ? request.getQualifications() : "M.Sc. Clinical Psychology")
                    .experienceYears(request.getExperienceYears() > 0 ? request.getExperienceYears() : 3)
                    .availableDays(request.getAvailableDays() != null && !request.getAvailableDays().isEmpty() ? request.getAvailableDays() : List.of("Monday", "Tuesday", "Wednesday", "Thursday", "Friday"))
                    .availableSlots(request.getAvailableSlots() != null && !request.getAvailableSlots().isEmpty() ? request.getAvailableSlots() : List.of("09:00 - 10:00", "10:30 - 11:30", "14:00 - 15:00", "15:30 - 16:30"))
                    .officeLocation(request.getOfficeLocation() != null ? request.getOfficeLocation() : "Student Wellness Center, Rm 101")
                    .contactNumber(request.getContactNumber())
                    .bio(request.getBio())
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            Counselor savedCounselor = counselorRepository.save(counselor);
            counselorDTO = mapToCounselorDTO(savedCounselor);
        }

        UserDetailsImpl userDetails = UserDetailsImpl.build(savedUser);
        String token = jwtUtil.generateToken(userDetails);

        auditLogService.log(savedUser.getId(), savedUser.getName(), savedUser.getRole(), "USER_REGISTER", "User", savedUser.getId(), "User registered account", null);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToUserDTO(savedUser))
                .student(studentDTO)
                .counselor(counselorDTO)
                .build();
    }

    public UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .avatar(user.getAvatar())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public StudentDTO mapToStudentDTO(Student s) {
        return StudentDTO.builder()
                .id(s.getId())
                .userId(s.getUserId())
                .name(s.getName())
                .email(s.getEmail())
                .avatar(s.getAvatar())
                .registerNumber(s.getRegisterNumber())
                .departmentId(s.getDepartmentId())
                .departmentName(s.getDepartmentName())
                .yearOfStudy(s.getYearOfStudy())
                .currentWellnessScore(s.getCurrentWellnessScore())
                .stressScore(s.getStressScore())
                .anxietyScore(s.getAnxietyScore())
                .sleepScore(s.getSleepScore())
                .riskLevel(s.getRiskLevel())
                .assignedCounselorId(s.getAssignedCounselorId())
                .assignedCounselorName(s.getAssignedCounselorName())
                .contactNumber(s.getContactNumber())
                .emergencyContact(s.getEmergencyContact())
                .bio(s.getBio())
                .lastAssessmentDate(s.getLastAssessmentDate())
                .createdAt(s.getCreatedAt())
                .build();
    }

    public CounselorDTO mapToCounselorDTO(Counselor c) {
        return CounselorDTO.builder()
                .id(c.getId())
                .userId(c.getUserId())
                .name(c.getName())
                .email(c.getEmail())
                .avatar(c.getAvatar())
                .specialization(c.getSpecialization())
                .qualifications(c.getQualifications())
                .experienceYears(c.getExperienceYears())
                .availableDays(c.getAvailableDays())
                .availableSlots(c.getAvailableSlots())
                .officeLocation(c.getOfficeLocation())
                .contactNumber(c.getContactNumber())
                .bio(c.getBio())
                .active(c.isActive())
                .activeStudentCount(c.getActiveStudentCount())
                .totalSessionsConducted(c.getTotalSessionsConducted())
                .rating(c.getRating())
                .createdAt(c.getCreatedAt())
                .build();
    }

    public AuthResponse authenticateGoogle(GoogleAuthRequest request) {
        try {
            String token = request.getCredential();
            String[] parts = token.split("\\.");
            if (parts.length < 2) {
                throw new BadRequestException("Invalid Google token format");
            }

            String payloadJson = new String(java.util.Base64.getUrlDecoder().decode(parts[1]), java.nio.charset.StandardCharsets.UTF_8);
            com.fasterxml.jackson.databind.JsonNode payloadNode = new com.fasterxml.jackson.databind.ObjectMapper().readTree(payloadJson);

            String email = payloadNode.has("email") ? payloadNode.get("email").asText().toLowerCase().trim() : null;
            String name = payloadNode.has("name") ? payloadNode.get("name").asText() : "Google User";
            String picture = payloadNode.has("picture") ? payloadNode.get("picture").asText() : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email;

            if (email == null || email.isBlank()) {
                throw new BadRequestException("Google token does not contain a valid email");
            }

            User user = userRepository.findByEmail(email).orElse(null);
            Student student = null;
            Counselor counselor = null;

            if (user == null) {
                // Determine Role
                Role role = request.getRole() != null ? request.getRole() : Role.ROLE_STUDENT;

                user = User.builder()
                        .email(email)
                        .name(name)
                        .password(passwordEncoder.encode(java.util.UUID.randomUUID().toString()))
                        .role(role)
                        .avatar(picture)
                        .active(true)
                        .createdAt(LocalDateTime.now())
                        .build();

                user = userRepository.save(user);

                if (role == Role.ROLE_STUDENT) {
                    Department department = null;
                    if (request.getDepartmentId() != null) {
                        department = departmentRepository.findById(request.getDepartmentId()).orElse(null);
                    }
                    if (department == null) {
                        department = departmentRepository.findAll().stream().findFirst().orElse(null);
                    }

                    List<Counselor> availableCounselors = counselorRepository.findAll();
                    Counselor assigned = !availableCounselors.isEmpty() ? availableCounselors.get(0) : null;

                    student = Student.builder()
                            .userId(user.getId())
                            .name(user.getName())
                            .email(user.getEmail())
                            .avatar(user.getAvatar())
                            .registerNumber(request.getRegisterNumber() != null ? request.getRegisterNumber() : "REG" + System.currentTimeMillis() % 100000)
                            .departmentId(department != null ? department.getId() : null)
                            .departmentName(department != null ? department.getName() : "General Studies")
                            .yearOfStudy(request.getYearOfStudy() != null ? request.getYearOfStudy() : 1)
                            .currentWellnessScore(null)
                            .stressScore(null)
                            .anxietyScore(null)
                            .sleepScore(null)
                            .riskLevel(null)
                            .assignedCounselorId(assigned != null ? assigned.getId() : null)
                            .assignedCounselorName(assigned != null ? assigned.getName() : null)
                            .emergencyContact(request.getEmergencyContact() != null ? request.getEmergencyContact() : "")
                            .bio("Student signed up via Google Account.")
                            .createdAt(LocalDateTime.now())
                            .build();

                    student = studentRepository.save(student);
                } else if (role == Role.ROLE_COUNSELOR) {
                    counselor = Counselor.builder()
                            .userId(user.getId())
                            .name(user.getName())
                            .email(user.getEmail())
                            .avatar(user.getAvatar())
                            .specialization(request.getSpecialization() != null ? request.getSpecialization() : "Student Mental Health & Counseling")
                            .qualifications(request.getQualifications() != null ? request.getQualifications() : "Licensed Psychologist")
                            .experienceYears(3)
                            .availableDays(List.of("Monday", "Wednesday", "Friday"))
                            .availableSlots(List.of("10:00 - 11:00 AM", "02:00 - 03:00 PM"))
                            .officeLocation("Wellness Center")
                            .active(true)
                            .rating(5.0)
                            .activeStudentCount(0)
                            .totalSessionsConducted(0)
                            .createdAt(LocalDateTime.now())
                            .build();

                    counselor = counselorRepository.save(counselor);
                }
            } else {
                if (!user.isActive()) {
                    throw new BadRequestException("Account has been suspended. Please contact platform administration.");
                }
                if (user.getRole() == Role.ROLE_STUDENT) {
                    student = studentRepository.findByUserId(user.getId()).orElse(null);
                } else if (user.getRole() == Role.ROLE_COUNSELOR) {
                    counselor = counselorRepository.findByUserId(user.getId()).orElse(null);
                }
            }

            UserDetailsImpl userDetails = UserDetailsImpl.build(user);
            String jwtToken = jwtUtil.generateToken(userDetails);

            auditLogService.log(user.getId(), user.getName(), user.getRole(), "GOOGLE_LOGIN", "User", user.getId(), "User logged in via Google OAuth2 SSO", null);

            return AuthResponse.builder()
                    .token(jwtToken)
                    .tokenType("Bearer")
                    .user(mapToUserDTO(user))
                    .student(student != null ? mapToStudentDTO(student) : null)
                    .counselor(counselor != null ? mapToCounselorDTO(counselor) : null)
                    .build();
        } catch (Exception e) {
            log.error("Google Auth error", e);
            throw new BadRequestException("Google Authentication failed: " + e.getMessage());
        }
    }
}
