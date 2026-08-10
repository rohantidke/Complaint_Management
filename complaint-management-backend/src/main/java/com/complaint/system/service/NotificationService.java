
package com.complaint.system.service;

import com.complaint.system.entity.User;

import java.util.List;

public interface NotificationService {

    void createNotification(
            User user,
            String message
    );

    List<?> getMyNotifications(
            String userEmail
    );

    long getUnreadCount(
            String userEmail
    );

    void markAsRead(
            Long notificationId,
            String userEmail
    );
}

