package com.complaint.system.controller;

import com.complaint.system.dto.StaffComplaintResponse;
import com.complaint.system.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/complaints")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STAFF')")
public class StaffComplaintController {

    private final ComplaintService complaintService;

    @GetMapping
    public ResponseEntity<List<StaffComplaintResponse>>
    getAssignedComplaints(
            Authentication authentication) {

        return ResponseEntity.ok(
                complaintService.getAssignedComplaints(
                        authentication.getName()
                )
        );
    }

    @PutMapping("/{complaintNumber}/start")
    public ResponseEntity<StaffComplaintResponse>
    startComplaint(
            @PathVariable String complaintNumber,
            Authentication authentication) {

        return ResponseEntity.ok(
                complaintService.startComplaint(
                        complaintNumber,
                        authentication.getName()
                )
        );
    }

    @PutMapping("/{complaintNumber}/resolve")
    public ResponseEntity<StaffComplaintResponse>
    resolveComplaint(
            @PathVariable String complaintNumber,
            Authentication authentication) {

        return ResponseEntity.ok(
                complaintService.resolveComplaint(
                        complaintNumber,
                        authentication.getName()
                )
        );
    }
}