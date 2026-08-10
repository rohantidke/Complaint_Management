package com.complaint.system.service.impl;

import com.complaint.system.dto.FeedbackRequest;
import com.complaint.system.dto.FeedbackResponse;
import com.complaint.system.entity.Complaint;
import com.complaint.system.entity.ComplaintFeedback;
import com.complaint.system.entity.User;
import com.complaint.system.enums.ComplaintStatus;
import com.complaint.system.exception.BadRequestException;
import com.complaint.system.exception.ResourceNotFoundException;
import com.complaint.system.exception.UnauthorizedException;
import com.complaint.system.repository.ComplaintFeedbackRepository;
import com.complaint.system.repository.ComplaintRepository;
import com.complaint.system.repository.UserRepository;
import com.complaint.system.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl
        implements FeedbackService {

    private final ComplaintRepository complaintRepository;

    private final ComplaintFeedbackRepository
            complaintFeedbackRepository;

    private final UserRepository userRepository;


    // ==========================================
    // CREATE FEEDBACK
    // ==========================================

    @Override
    @Transactional
    public FeedbackResponse createFeedback(
            String complaintNumber,
            String userEmail,
            FeedbackRequest request) {

        // ======================================
        // FIND USER
        // ======================================

        User user =
                userRepository
                        .findByEmail(userEmail)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );


        // ======================================
        // FIND COMPLAINT
        // ======================================

        Complaint complaint =
                complaintRepository
                        .findByComplaintNumber(
                                complaintNumber
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Complaint not found"
                                )
                        );


        // ======================================
        // SECURITY CHECK
        // ======================================

        if (complaint.getUser() == null
                || !complaint.getUser()
                        .getId()
                        .equals(user.getId())) {

            throw new UnauthorizedException(
                    "You can only rate your own complaint"
            );
        }


        // ======================================
        // STATUS CHECK
        // ======================================

        if (complaint.getStatus()
                != ComplaintStatus.RESOLVED) {

            throw new BadRequestException(
                    "Feedback can only be submitted after the complaint is resolved"
            );
        }


        // ======================================
        // CHECK EXISTING FEEDBACK
        // ======================================

        if (complaintFeedbackRepository
                .existsByComplaintId(
                        complaint.getId()
                )) {

            throw new BadRequestException(
                    "Feedback has already been submitted for this complaint"
            );
        }


        // ======================================
        // VALIDATE RATING
        // ======================================

        if (request.getRating() == null
                || request.getRating() < 1
                || request.getRating() > 5) {

            throw new BadRequestException(
                    "Rating must be between 1 and 5"
            );
        }


        // ======================================
        // CREATE FEEDBACK
        // ======================================

        ComplaintFeedback feedback =
                ComplaintFeedback.builder()
                        .complaint(complaint)
                        .user(user)
                        .rating(request.getRating())
                        .comment(request.getComment())
                        .build();


        feedback =
                complaintFeedbackRepository
                        .save(feedback);


        // ======================================
        // RESPONSE
        // ======================================

        return mapToResponse(feedback);
    }


    // ==========================================
    // GET FEEDBACK
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public FeedbackResponse getFeedback(
            String complaintNumber,
            String userEmail) {

        User user =
                userRepository
                        .findByEmail(userEmail)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );


        Complaint complaint =
                complaintRepository
                        .findByComplaintNumber(
                                complaintNumber
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Complaint not found"
                                )
                        );


        // ======================================
        // SECURITY CHECK
        // ======================================

        if (complaint.getUser() == null
                || !complaint.getUser()
                        .getId()
                        .equals(user.getId())) {

            throw new UnauthorizedException(
                    "You are not allowed to view this feedback"
            );
        }


        ComplaintFeedback feedback =
                complaintFeedbackRepository
                        .findByComplaintId(
                                complaint.getId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Feedback not found"
                                )
                        );


        return mapToResponse(feedback);
    }


    // ==========================================
    // MAPPER
    // ==========================================

    private FeedbackResponse mapToResponse(
            ComplaintFeedback feedback) {

        return FeedbackResponse.builder()
                .id(feedback.getId())
                .complaintNumber(
                        feedback.getComplaint()
                                .getComplaintNumber()
                )
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .userName(
                        feedback.getUser()
                                .getName()
                )
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}