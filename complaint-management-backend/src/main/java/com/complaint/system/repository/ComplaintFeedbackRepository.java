package com.complaint.system.repository;

import com.complaint.system.entity.ComplaintFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ComplaintFeedbackRepository
        extends JpaRepository<ComplaintFeedback, Long> {

    Optional<ComplaintFeedback> findByComplaintId(
            Long complaintId
    );

    boolean existsByComplaintId(
            Long complaintId
    );
}