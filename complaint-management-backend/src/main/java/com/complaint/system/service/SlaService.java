
package com.complaint.system.service;

import com.complaint.system.enums.Priority;

import java.time.LocalDateTime;

public interface SlaService {

    LocalDateTime calculateDeadline(
            Priority priority
    );

    boolean isOverdue(
            LocalDateTime slaDeadline
    );
}

