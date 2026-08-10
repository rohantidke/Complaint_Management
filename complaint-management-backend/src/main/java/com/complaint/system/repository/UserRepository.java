package com.complaint.system.repository;

import com.complaint.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import com.complaint.system.enums.Role;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);
    
    Optional<User> findFirstByRole(Role role);

List<User> findByRoleAndEnabled(
        Role role,
        Boolean enabled
);

List<User> findByRoleAndDepartmentId(
        Role role,
        Long departmentId
);
}