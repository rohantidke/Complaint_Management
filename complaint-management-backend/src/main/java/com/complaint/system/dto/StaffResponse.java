package com.complaint.system.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class StaffResponse {

    private Long id;

    private String name;

    private String email;

    private String phone;

    private String role;

    private Boolean enabled;

    private Long departmentId;

    private String departmentName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}