package com.complaint.system.service;

import com.complaint.system.dto.LoginRequest;
import com.complaint.system.dto.LoginResponse;
import com.complaint.system.dto.RegisterRequest;

public interface AuthService {

    String register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    void forgotPassword(String email);

void resetPassword(
        String token,
        String password,
        String confirmPassword
);
}