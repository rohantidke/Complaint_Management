package com.complaint.system.dto;

import com.complaint.system.enums.ComplaintStatus;
import com.complaint.system.enums.Priority;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminComplaintResponse {

    private Long id;

    private String complaintNumber;

    private String title;

    private String description;

    private String category;

    private Priority priority;

    private ComplaintStatus status;

    private String location;

    private Long userId;

    private String userName;

    private String userEmail;

    private Long departmentId;

    private String departmentName;

    private Long assignedStaffId;

    private String assignedStaffName;

    private LocalDateTime slaDeadline;

    
    private boolean overdue;

    private LocalDateTime resolvedAt;

    private LocalDateTime closedAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    
}