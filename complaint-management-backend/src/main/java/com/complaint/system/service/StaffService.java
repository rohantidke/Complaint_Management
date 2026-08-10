package com.complaint.system.service;

import com.complaint.system.dto.StaffRequest;
import com.complaint.system.dto.StaffResponse;

import java.util.List;

public interface StaffService {

    StaffResponse createStaff(
            StaffRequest request
    );

    List<StaffResponse> getAllStaff();

    List<StaffResponse> getStaffByDepartment(
            Long departmentId
    );

    StaffResponse getStaffById(
            Long id
    );

    StaffResponse updateStaff(
            Long id,
            StaffRequest request
    );

    void deactivateStaff(
            Long id
    );

    StaffResponse activateStaff(Long id);
}