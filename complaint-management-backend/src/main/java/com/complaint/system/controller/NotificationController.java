
package com.complaint.system.controller;

import com.complaint.system.service.NotificationService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'STAFF', 'ADMIN')")
public class NotificationController {

    private final NotificationService notificationService;

    // Get logged-in user's notifications
    @GetMapping
    public ResponseEntity<?> getMyNotifications(
            Authentication authentication) {

        return ResponseEntity.ok(
                notificationService.getMyNotifications(
                        authentication.getName()
                )
        );
    }

    // Get unread notification count
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(
            Authentication authentication) {

        return ResponseEntity.ok(
                notificationService.getUnreadCount(
                        authentication.getName()
                )
        );
    }

    // Mark notification as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long notificationId,
            Authentication authentication) {

        notificationService.markAsRead(
                notificationId,
                authentication.getName()
        );

        return ResponseEntity.ok().build();
    }
}

