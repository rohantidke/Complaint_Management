package com.complaint.system.util;

import org.springframework.stereotype.Component;

import java.time.Year;
import java.util.UUID;

@Component
public class ComplaintNumberGenerator {

    public String generate() {

        String year = String.valueOf(Year.now().getValue());

        String randomPart = UUID.randomUUID()
                .toString()
                .substring(0, 8)
                .toUpperCase();

        return "CMP-" + year + "-" + randomPart;
    }
}