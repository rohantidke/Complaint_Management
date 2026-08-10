package com.complaint.system.controller;

import com.complaint.system.dto.ComplaintHistoryResponse;
import com.complaint.system.dto.ComplaintRequest;
import com.complaint.system.dto.ComplaintResponse;
import com.complaint.system.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ComplaintResponse> createComplaint(
            @Valid @RequestBody ComplaintRequest request,
            Authentication authentication
    ) {

        ComplaintResponse response =
                complaintService.createComplaint(
                        request,
                        authentication.getName()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ComplaintResponse>>
    getMyComplaints(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                complaintService.getMyComplaints(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/{complaintNumber}")
    public ResponseEntity<ComplaintResponse>
    getComplaint(
            @PathVariable String complaintNumber,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                complaintService.getComplaintByNumber(
                        complaintNumber,
                        authentication.getName()
                )
        );
    }

    @GetMapping("/{complaintNumber}/history")
    public ResponseEntity<List<ComplaintHistoryResponse>>
    getComplaintHistory(
            @PathVariable String complaintNumber,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                complaintService.getComplaintHistory(
                        complaintNumber,
                        authentication.getName()
                )
        );
    }
}