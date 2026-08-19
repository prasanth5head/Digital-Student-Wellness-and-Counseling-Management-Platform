package com.wellness.controller;

import com.wellness.dto.ApiResponse;
import com.wellness.dto.DepartmentAnalyticsDTO;
import com.wellness.model.Department;
import com.wellness.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Department>>> getAllDepartments() {
        List<Department> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(ApiResponse.ok(departments));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Department>> getDepartmentById(@PathVariable String id) {
        Department dept = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(ApiResponse.ok(dept));
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<ApiResponse<DepartmentAnalyticsDTO>> getDepartmentAnalytics(@PathVariable String id) {
        DepartmentAnalyticsDTO analytics = departmentService.getDepartmentAnalytics(id);
        return ResponseEntity.ok(ApiResponse.ok(analytics));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Department>> createDepartment(@RequestBody Department department) {
        Department saved = departmentService.createDepartment(department);
        return ResponseEntity.ok(ApiResponse.ok("Department created", saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Department>> updateDepartment(
            @PathVariable String id,
            @RequestBody Department department) {
        Department updated = departmentService.updateDepartment(id, department);
        return ResponseEntity.ok(ApiResponse.ok("Department updated", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable String id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(ApiResponse.ok("Department deleted", null));
    }
}
