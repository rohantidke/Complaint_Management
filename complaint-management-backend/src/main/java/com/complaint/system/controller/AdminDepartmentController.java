package com.complaint.system.controller;

import com.complaint.system.dto.DepartmentRequest;
import com.complaint.system.dto.DepartmentResponse;
import com.complaint.system.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/departments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    public ResponseEntity<DepartmentResponse>
    createDepartment(
            @Valid @RequestBody DepartmentRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        departmentService
                                .createDepartment(request)
                );
    }

    @GetMapping
    public ResponseEntity<List<DepartmentResponse>>
    getAllDepartments() {

        return ResponseEntity.ok(
                departmentService
                        .getAllDepartments()
        );
    }

    @GetMapping("/active")
    public ResponseEntity<List<DepartmentResponse>>
    getActiveDepartments() {

        return ResponseEntity.ok(
                departmentService
                        .getActiveDepartments()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentResponse>
    getDepartment(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                departmentService
                        .getDepartmentById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentResponse>
    updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequest request) {

        return ResponseEntity.ok(
                departmentService.updateDepartment(
                        id,
                        request
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deactivateDepartment(
            @PathVariable Long id) {

        departmentService
                .deactivateDepartment(id);

        return ResponseEntity.noContent()
                .build();
    }

    @PutMapping("/{id}/activate")
public ResponseEntity<DepartmentResponse>
activateDepartment(
        @PathVariable Long id) {

    return ResponseEntity.ok(
            departmentService
                    .activateDepartment(id)
    );
}
}