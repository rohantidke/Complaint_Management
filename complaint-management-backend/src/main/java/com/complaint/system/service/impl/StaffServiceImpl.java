package com.complaint.system.service.impl;

import com.complaint.system.dto.StaffRequest;
import com.complaint.system.dto.StaffResponse;
import com.complaint.system.entity.Department;
import com.complaint.system.entity.User;
import com.complaint.system.enums.Role;
import com.complaint.system.exception.BadRequestException;
import com.complaint.system.exception.ResourceNotFoundException;
import com.complaint.system.repository.DepartmentRepository;
import com.complaint.system.repository.UserRepository;
import com.complaint.system.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public StaffResponse createStaff(StaffRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {

            throw new BadRequestException(
                    "Email already registered"
            );
        }

        Department department =
                departmentRepository
                        .findById(request.getDepartmentId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Department not found"
                                )
                        );

        if (!department.getActive()) {

            throw new BadRequestException(
                    "Department is inactive"
            );
        }

        User staff = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .phone(request.getPhone())
                .role(Role.STAFF)
                .enabled(true)
                .department(department)
                .build();

        staff = userRepository.save(staff);

        return mapToResponse(staff);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StaffResponse> getAllStaff() {

        return userRepository.findAll()
                .stream()
                .filter(user ->
                        user.getRole() == Role.STAFF
                )
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StaffResponse> getStaffByDepartment(
            Long departmentId) {

        Department department =
                departmentRepository
                        .findById(departmentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Department not found"
                                )
                        );

        return userRepository
                .findByRoleAndDepartmentId(
                        Role.STAFF,
                        department.getId()
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public StaffResponse getStaffById(Long id) {

        User staff = getStaffEntity(id);

        return mapToResponse(staff);
    }

    @Override
    @Transactional
    public StaffResponse updateStaff(
            Long id,
            StaffRequest request) {

        User staff = getStaffEntity(id);

        if (!staff.getEmail()
                .equalsIgnoreCase(request.getEmail())
                &&
                userRepository
                        .findByEmail(request.getEmail())
                        .isPresent()) {

            throw new BadRequestException(
                    "Email already registered by another user"
            );
        }

        Department department =
                departmentRepository
                        .findById(request.getDepartmentId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Department not found"
                                )
                        );

        if (!department.getActive()) {

            throw new BadRequestException(
                    "Department is inactive"
            );
        }

        staff.setName(request.getName());

        staff.setEmail(request.getEmail());

        staff.setPhone(request.getPhone());

        staff.setDepartment(department);

        /*
         * Only update password when a new password is supplied.
         */
        if (request.getPassword() != null
                && !request.getPassword().isBlank()) {

            staff.setPassword(
                    passwordEncoder.encode(
                            request.getPassword()
                    )
            );
        }

        staff = userRepository.save(staff);

        return mapToResponse(staff);
    }

    @Override
    @Transactional
    public void deactivateStaff(Long id) {

        User staff = getStaffEntity(id);

        staff.setEnabled(false);

        userRepository.save(staff);
    }

    private User getStaffEntity(Long id) {

        User staff =
                userRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Staff not found"
                                )
                        );

        if (staff.getRole() != Role.STAFF) {

            throw new BadRequestException(
                    "Selected user is not a staff member"
            );
        }

        return staff;
    }

    private StaffResponse mapToResponse(User staff) {

        Long departmentId = null;
        String departmentName = null;

        if (staff.getDepartment() != null) {

            departmentId =
                    staff.getDepartment().getId();

            departmentName =
                    staff.getDepartment().getName();
        }

        return StaffResponse.builder()
                .id(staff.getId())
                .name(staff.getName())
                .email(staff.getEmail())
                .phone(staff.getPhone())
                .role(staff.getRole().name())
                .enabled(staff.getEnabled())
                .departmentId(departmentId)
                .departmentName(departmentName)
                .createdAt(staff.getCreatedAt())
                .updatedAt(staff.getUpdatedAt())
                .build();
    }

    @Override
@Transactional
public StaffResponse activateStaff(Long id) {

    User staff = getStaffEntity(id);

    staff.setEnabled(true);

    User savedStaff =
            userRepository.save(staff);

    return mapToResponse(savedStaff);
}

    
}