package com.complaint.system.service.impl;

import com.complaint.system.enums.Priority;
import com.complaint.system.service.SlaService;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;

@Service
public class SlaServiceImpl implements SlaService {

@Override
public LocalDateTime calculateDeadline(
        Priority priority) {

    if (priority == null) {
        priority = Priority.MEDIUM;
    }

    switch (priority) {

        case HIGH:
            return LocalDateTime.now()
                    .plusHours(24);

        case MEDIUM:
            return LocalDateTime.now()
                    .plusHours(48);

        case LOW:
            return LocalDateTime.now()
                    .plusHours(72);

        default:
            return LocalDateTime.now()
                    .plusHours(48);
    }
}



    @Override
    public boolean isOverdue(LocalDateTime slaDeadline) {

        if (slaDeadline == null) {
            return false;
        }

        return LocalDateTime.now().isAfter(slaDeadline);
    }
}