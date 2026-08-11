package com.complaint.system.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping({"/", "/api/health"})
    public Map<String, String> health() {
        return Map.of(
                "status", "UP",
                "application", "Complaint Registration Management System API",
                "version", "1.0.0"
        );
    }
}