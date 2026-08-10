package com.complaint.system.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComplaintAssignmentRequest {

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Staff ID is required")
    private Long staffId;
}