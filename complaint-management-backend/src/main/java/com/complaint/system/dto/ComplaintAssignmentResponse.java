package com.complaint.system.dto;

import com.complaint.system.enums.ComplaintStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ComplaintAssignmentResponse {

    private String complaintNumber;

    private ComplaintStatus status;

    private Long departmentId;

    private String departmentName;

    private Long staffId;

    private String staffName;

    private String message;
}