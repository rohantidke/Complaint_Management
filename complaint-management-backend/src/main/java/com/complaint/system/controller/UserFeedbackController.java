package com.complaint.system.controller;

import com.complaint.system.dto.FeedbackRequest;
import com.complaint.system.dto.FeedbackResponse;
import com.complaint.system.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/complaints")
@RequiredArgsConstructor
public class UserFeedbackController {

    private final FeedbackService feedbackService;


    // ==========================================
    // SUBMIT FEEDBACK
    // ==========================================

    @PostMapping("/{complaintNumber}/feedback")
    public ResponseEntity<FeedbackResponse> createFeedback(
            @PathVariable String complaintNumber,
            @Valid @RequestBody FeedbackRequest request,
            Authentication authentication) {

        String userEmail =
                authentication.getName();

        FeedbackResponse response =
                feedbackService.createFeedback(
                        complaintNumber,
                        userEmail,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // ==========================================
    // GET FEEDBACK
    // ==========================================

    @GetMapping("/{complaintNumber}/feedback")
    public ResponseEntity<FeedbackResponse> getFeedback(
            @PathVariable String complaintNumber,
            Authentication authentication) {

        String userEmail =
                authentication.getName();

        return ResponseEntity.ok(
                feedbackService.getFeedback(
                        complaintNumber,
                        userEmail
                )
        );
    }
}