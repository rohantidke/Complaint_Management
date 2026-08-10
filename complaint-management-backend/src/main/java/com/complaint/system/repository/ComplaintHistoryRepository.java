package com.complaint.system.repository;

import com.complaint.system.entity.ComplaintHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintHistoryRepository
        extends JpaRepository<ComplaintHistory, Long> {

    List<ComplaintHistory> findByComplaintIdOrderByCreatedAtAsc(Long complaintId);
}