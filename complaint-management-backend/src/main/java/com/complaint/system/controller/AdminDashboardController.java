package com.complaint.system.controller;

import com.complaint.system.dto.AdminDashboardStatsResponse;
import com.complaint.system.service.AdminComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final AdminComplaintService adminComplaintService;

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStatsResponse> getDashboardStats() {

        return ResponseEntity.ok(
                adminComplaintService.getDashboardStats()
        );
    }
}