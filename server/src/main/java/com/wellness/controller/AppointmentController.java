package com.wellness.controller;

import com.wellness.dto.ApiResponse;
import com.wellness.dto.AppointmentCreateDTO;
import com.wellness.dto.AppointmentUpdateDTO;
import com.wellness.model.Appointment;
import com.wellness.security.UserDetailsImpl;
import com.wellness.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<Appointment>> createAppointment(@Valid @RequestBody AppointmentCreateDTO dto) {
        Appointment appointment = appointmentService.createAppointment(dto);
        return ResponseEntity.ok(ApiResponse.ok("Appointment scheduled successfully", appointment));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<Appointment>> updateAppointment(
            @PathVariable String id,
            @RequestBody AppointmentUpdateDTO dto) {
        Appointment appointment = appointmentService.updateAppointment(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Appointment updated", appointment));
    }

    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Appointment>> cancelAppointment(
            @PathVariable String id,
            @RequestParam(required = false) String reason,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Appointment appointment = appointmentService.cancelAppointment(id, reason, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Appointment cancelled", appointment));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getAllAppointments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(appointmentService.getAllAppointments(page, size)));
    }
}
