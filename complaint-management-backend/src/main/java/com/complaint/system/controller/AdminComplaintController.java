
package com.complaint.system.controller;

import com.complaint.system.dto.AdminComplaintResponse;
import com.complaint.system.dto.ComplaintAssignmentRequest;
import com.complaint.system.dto.ComplaintAssignmentResponse;
import com.complaint.system.dto.ComplaintHistoryResponse;
import com.complaint.system.enums.ComplaintStatus;
import com.complaint.system.enums.Priority;
import com.complaint.system.service.AdminComplaintService;
import com.complaint.system.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;


import java.util.List;

@RestController
@RequestMapping("/api/admin/complaints")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminComplaintController {

    private final AdminComplaintService adminComplaintService;

    private final ComplaintService complaintService;


    // ==========================================
    // GET ALL / FILTER COMPLAINTS
    // ==========================================



@GetMapping
public ResponseEntity<Page<AdminComplaintResponse>>
getComplaints(

        @RequestParam(required = false)
        ComplaintStatus status,

        @RequestParam(required = false)
        Priority priority,

        @RequestParam(required = false)
        Long departmentId,

        @RequestParam(defaultValue = "0")
        int page,

        @RequestParam(defaultValue = "10")
        int size,

        @RequestParam(defaultValue = "createdAt,desc")
        String sort) {

    String[] sortParts = sort.split(",");

    String sortField = sortParts[0];

    Sort.Direction direction =
            sortParts.length > 1
                    && sortParts[1].equalsIgnoreCase("desc")
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;

    Pageable pageable =
            PageRequest.of(
                    page,
                    size,
                    Sort.by(direction, sortField)
            );

    return ResponseEntity.ok(
            adminComplaintService.filterComplaints(
                    status,
                    priority,
                    departmentId,
                    pageable
            )
    );
}

@GetMapping("/overdue")
public ResponseEntity<List<AdminComplaintResponse>>
getOverdueComplaints() {

    return ResponseEntity.ok(
            adminComplaintService.getOverdueComplaints()
    );
}








    // ==========================================
    // GET SINGLE COMPLAINT
    // ==========================================

    @GetMapping("/{complaintNumber}")
    public ResponseEntity<AdminComplaintResponse>
    getComplaint(
            @PathVariable String complaintNumber) {

        return ResponseEntity.ok(
                adminComplaintService.getComplaint(
                        complaintNumber
                )
        );
    }


    // ==========================================
    // GET COMPLAINT HISTORY
    // ==========================================

    @GetMapping("/{complaintNumber}/history")
    public ResponseEntity<List<ComplaintHistoryResponse>>
    getHistory(
            @PathVariable String complaintNumber) {

        return ResponseEntity.ok(
                complaintService
                        .getComplaintHistoryForAdmin(
                                complaintNumber
                        )
        );
    }


    // ==========================================
    // ASSIGN COMPLAINT
    // ==========================================

    @PutMapping("/{complaintNumber}/assign")
    public ResponseEntity<ComplaintAssignmentResponse>
    assignComplaint(
            @PathVariable String complaintNumber,

            @Valid @RequestBody
            ComplaintAssignmentRequest request,

            Authentication authentication) {

        return ResponseEntity.ok(
                complaintService.assignComplaint(
                        complaintNumber,
                        request,
                        authentication.getName()
                )
        );
    }
}
