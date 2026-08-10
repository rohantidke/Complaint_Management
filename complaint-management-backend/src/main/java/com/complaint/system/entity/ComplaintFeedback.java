package com.complaint.system.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "complaint_feedback",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_feedback_complaint",
            columnNames = "complaint_id"
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "complaint_id",
        nullable = false
    )
    private Complaint complaint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "user_id",
        nullable = false
    )
    private User user;

    @Column(
        nullable = false
    )
    private Integer rating;

    @Column(
        length = 1000
    )
    private String comment;

    @Column(
        name = "created_at",
        nullable = false
    )
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}