package com.complaint.system.service;

import com.complaint.system.dto.FeedbackRequest;
import com.complaint.system.dto.FeedbackResponse;

public interface FeedbackService {

    FeedbackResponse createFeedback(
            String complaintNumber,
            String userEmail,
            FeedbackRequest request
    );

    FeedbackResponse getFeedback(
            String complaintNumber,
            String userEmail
    );
}