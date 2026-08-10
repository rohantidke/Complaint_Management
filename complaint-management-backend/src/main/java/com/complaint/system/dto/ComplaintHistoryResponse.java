package com.complaint.system.dto;

import com.complaint.system.enums.ComplaintStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ComplaintHistoryResponse {

    private ComplaintStatus oldStatus;

    private ComplaintStatus newStatus;

    private String comment;

    private String changedBy;

    private LocalDateTime createdAt;
}