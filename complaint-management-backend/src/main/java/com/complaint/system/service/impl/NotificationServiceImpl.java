package com.complaint.system.service.impl;

import com.complaint.system.entity.Notification;
import com.complaint.system.entity.User;
import com.complaint.system.exception.ResourceNotFoundException;
import com.complaint.system.exception.UnauthorizedException;
import com.complaint.system.repository.NotificationRepository;
import com.complaint.system.repository.UserRepository;
import com.complaint.system.service.NotificationService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;

    private final UserRepository userRepository;

    @Override
    @Transactional
    public void createNotification(
            User user,
            String message) {

        Notification notification =
                Notification.builder()
                        .user(user)
                        .message(message)
                        .isRead(false)
                        .createdAt(LocalDateTime.now())
                        .build();

        notificationRepository.save(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<?> getMyNotifications(
            String userEmail) {

        User user =
                userRepository
                        .findByEmail(userEmail)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(
                        user.getId()
                );
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(
            String userEmail) {

        User user =
                userRepository
                        .findByEmail(userEmail)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        return notificationRepository
                .countByUserIdAndIsReadFalse(
                        user.getId()
                );
    }

    @Override
    @Transactional
    public void markAsRead(
            Long notificationId,
            String userEmail) {

        User user =
                userRepository
                        .findByEmail(userEmail)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Notification not found"
                                )
                        );

        if (notification.getUser() == null
                || !notification.getUser()
                        .getId()
                        .equals(user.getId())) {

            throw new UnauthorizedException(
                    "You are not authorized"
            );
        }

        notification.setRead(true);

        notificationRepository.save(notification);
    }
}