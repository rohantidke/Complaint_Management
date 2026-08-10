package com.complaint.system.dto;

import com.complaint.system.enums.ComplaintStatus;
import com.complaint.system.enums.Priority;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class StaffComplaintResponse {

    private Long id;

    private String complaintNumber;

    private String title;

    private String description;

    private String category;

    private Priority priority;

    private ComplaintStatus status;

    private String location;

    private String department;

    private String assignedStaff;

    private LocalDateTime slaDeadline;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime resolvedAt;
}