
package com.complaint.system.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardStatsResponse {

    private long totalComplaints;

    private long submitted;

    private long assigned;

    private long inProgress;

    private long resolved;

    private long closed;

    private long highPriority;

    private long overdue;
}

