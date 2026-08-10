package com.complaint.system.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackResponse {

    private Long id;

    private String complaintNumber;

    private Integer rating;

    private String comment;

    private String userName;

    private LocalDateTime createdAt;
}