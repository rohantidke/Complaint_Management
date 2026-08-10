package com.complaint.system.controller;

import com.complaint.system.dto.StaffRequest;
import com.complaint.system.dto.StaffResponse;
import com.complaint.system.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/staff")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminStaffController {

    private final StaffService staffService;


    // ==========================================
    // CREATE STAFF
    // ==========================================

    @PostMapping
    public ResponseEntity<StaffResponse> createStaff(
            @Valid @RequestBody StaffRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        staffService.createStaff(request)
                );
    }


    // ==========================================
    // GET ALL STAFF
    // ==========================================

    @GetMapping
    public ResponseEntity<List<StaffResponse>> getAllStaff() {

        return ResponseEntity.ok(
                staffService.getAllStaff()
        );
    }


    // ==========================================
    // GET STAFF BY DEPARTMENT
    // ==========================================

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<StaffResponse>> getStaffByDepartment(
            @PathVariable Long departmentId) {

        return ResponseEntity.ok(
                staffService.getStaffByDepartment(
                        departmentId
                )
        );
    }


    // ==========================================
    // GET STAFF BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<StaffResponse> getStaffById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                staffService.getStaffById(id)
        );
    }


    // ==========================================
    // UPDATE STAFF
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<StaffResponse> updateStaff(
            @PathVariable Long id,
            @Valid @RequestBody StaffRequest request) {

        return ResponseEntity.ok(
                staffService.updateStaff(
                        id,
                        request
                )
        );
    }


    // ==========================================
    // ACTIVATE STAFF
    // ==========================================

    @PutMapping("/{id}/activate")
    public ResponseEntity<StaffResponse> activateStaff(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                staffService.activateStaff(id)
        );
    }


    // ==========================================
    // DEACTIVATE STAFF
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateStaff(
            @PathVariable Long id) {

        staffService.deactivateStaff(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}