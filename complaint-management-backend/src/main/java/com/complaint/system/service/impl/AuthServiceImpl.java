package com.complaint.system.service.impl;

import com.complaint.system.dto.LoginRequest;
import com.complaint.system.dto.LoginResponse;
import com.complaint.system.dto.RegisterRequest;
import com.complaint.system.entity.PasswordResetToken;
import com.complaint.system.entity.User;
import com.complaint.system.enums.Role;
import com.complaint.system.exception.BadRequestException;
import com.complaint.system.exception.ResourceNotFoundException;
import com.complaint.system.repository.PasswordResetTokenRepository;
import com.complaint.system.repository.UserRepository;
import com.complaint.system.security.JwtService;
import com.complaint.system.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final PasswordResetTokenRepository
            passwordResetTokenRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final JavaMailSender mailSender;


    // =========================================================
    // REGISTER
    // =========================================================

    @Override
    @Transactional
    public String register(RegisterRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmail(email)) {

            throw new BadRequestException(
                    "Email is already registered"
            );
        }

        User user = User.builder()
                .name(request.getName())
                .email(email)
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .phone(request.getPhone())
                .role(Role.USER)
                .enabled(true)
                .build();

        userRepository.save(user);

        return "User registered successfully";
    }


    // =========================================================
    // LOGIN
    // =========================================================

    @Override
    public LoginResponse login(LoginRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.getPassword()
                )
        );

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new LoginResponse(
                token,
                "Bearer",
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }


    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    @Override
    @Transactional
    public void forgotPassword(String email) {

        String cleanEmail = email
                .trim()
                .toLowerCase();

        User user = userRepository
                .findByEmail(cleanEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        // -----------------------------------------------------
        // Delete old reset tokens
        // -----------------------------------------------------

        passwordResetTokenRepository
                .deleteByUser(user);

        // -----------------------------------------------------
        // Generate secure reset token
        // -----------------------------------------------------

        String token =
                UUID.randomUUID().toString();

        LocalDateTime expiry =
                LocalDateTime.now()
                        .plusMinutes(30);

        PasswordResetToken resetToken =
                PasswordResetToken.builder()
                        .token(token)
                        .user(user)
                        .expiresAt(expiry)
                        .used(false)
                        .build();

        passwordResetTokenRepository.save(
                resetToken
        );

        // -----------------------------------------------------
        // Create frontend reset URL
        // -----------------------------------------------------

        String resetLink =
                "http://localhost:5173/reset-password?token="
                        + token;

        // -----------------------------------------------------
        // Send reset email
        // -----------------------------------------------------

        sendPasswordResetEmail(
                user.getEmail(),
                user.getName(),
                resetLink
        );
    }


    // =========================================================
    // SEND PASSWORD RESET EMAIL
    // =========================================================

    private void sendPasswordResetEmail(
            String email,
            String name,
            String resetLink
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "CRMS - Password Reset Request"
        );

        message.setText(
                "Hello "
                        + (name != null
                        ? name
                        : "User")
                        + ",\n\n"

                        + "We received a request to reset "
                        + "your CRMS password.\n\n"

                        + "Click the link below to create "
                        + "a new password:\n\n"

                        + resetLink
                        + "\n\n"

                        + "This password reset link will "
                        + "expire in 30 minutes.\n\n"

                        + "If you did not request a password "
                        + "reset, you can safely ignore "
                        + "this email.\n\n"

                        + "Regards,\n"
                        + "Complaint Registration "
                        + "Management System"
        );

        mailSender.send(message);
    }


    // =========================================================
    // RESET PASSWORD
    // =========================================================

    @Override
    @Transactional
    public void resetPassword(
            String token,
            String password,
            String confirmPassword
    ) {

        // -----------------------------------------------------
        // Validate password
        // -----------------------------------------------------

        if (password == null
                || password.isBlank()) {

            throw new BadRequestException(
                    "Password is required"
            );
        }

        if (confirmPassword == null
                || confirmPassword.isBlank()) {

            throw new BadRequestException(
                    "Confirm password is required"
            );
        }

        if (!password.equals(confirmPassword)) {

            throw new BadRequestException(
                    "Passwords do not match"
            );
        }

        // -----------------------------------------------------
        // Validate token
        // -----------------------------------------------------

        if (token == null
                || token.isBlank()) {

            throw new BadRequestException(
                    "Reset token is required"
            );
        }

        PasswordResetToken resetToken =
                passwordResetTokenRepository
                        .findByTokenAndUsedFalse(token)
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "Invalid or expired reset token"
                                )
                        );

        // -----------------------------------------------------
        // Check expiration
        // -----------------------------------------------------

        if (resetToken.getExpiresAt() == null
                || LocalDateTime.now()
                .isAfter(resetToken.getExpiresAt())) {

            throw new BadRequestException(
                    "Password reset token has expired"
            );
        }

        // -----------------------------------------------------
        // Get user
        // -----------------------------------------------------

        User user = resetToken.getUser();

        if (user == null) {

            throw new ResourceNotFoundException(
                    "User associated with reset token not found"
            );
        }

        // -----------------------------------------------------
        // Update password
        // -----------------------------------------------------

        user.setPassword(
                passwordEncoder.encode(password)
        );

        userRepository.save(user);

        // -----------------------------------------------------
        // Invalidate token
        // -----------------------------------------------------

        resetToken.setUsed(true);

        passwordResetTokenRepository.save(
                resetToken
        );
    }
}