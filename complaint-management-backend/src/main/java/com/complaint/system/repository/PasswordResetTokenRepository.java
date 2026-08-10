package com.complaint.system.repository;

import com.complaint.system.entity.PasswordResetToken;
import com.complaint.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByTokenAndUsedFalse(
            String token
    );

    void deleteByUser(User user);
}