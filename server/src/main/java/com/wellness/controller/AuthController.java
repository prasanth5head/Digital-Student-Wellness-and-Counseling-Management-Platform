package com.wellness.controller;

import com.wellness.dto.ApiResponse;
import com.wellness.dto.AuthRequest;
import com.wellness.dto.AuthResponse;
import com.wellness.dto.RegisterRequest;
import com.wellness.model.User;
import com.wellness.repository.UserRepository;
import com.wellness.security.UserDetailsImpl;
import com.wellness.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful", response));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> googleAuth(@Valid @RequestBody com.wellness.dto.GoogleAuthRequest request) {
        AuthResponse response = authService.authenticateGoogle(request);
        return ResponseEntity.ok(ApiResponse.ok("Google authentication successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Object>> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.ok(ApiResponse.error("Not authenticated"));
        }
        User user = userRepository.findById(userDetails.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.ok(ApiResponse.error("User not found"));
        }
        return ResponseEntity.ok(ApiResponse.ok(authService.mapToUserDTO(user)));
    }
}
