package com.complaint.system.controller;

import com.complaint.system.dto.ForgotPasswordRequest;
import com.complaint.system.dto.LoginRequest;
import com.complaint.system.dto.LoginResponse;
import com.complaint.system.dto.RegisterRequest;
import com.complaint.system.dto.ResetPasswordRequest;
import com.complaint.system.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ==========================================
    // REGISTER
    // ==========================================

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(
                authService.register(request)
        );
    }

    // ==========================================
    // LOGIN
    // ==========================================

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    // ==========================================
    // FORGOT PASSWORD
    // ==========================================

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        authService.forgotPassword(
                request.getEmail()
        );

        return ResponseEntity.ok(
                "If an account exists with this email, " +
                "a password reset link has been sent."
        );
    }

    // ==========================================
    // RESET PASSWORD
    // ==========================================

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(
                request.getToken(),
                request.getPassword(),
                request.getConfirmPassword()
        );

        return ResponseEntity.ok(
                "Password reset successfully."
        );
    }
}