package com.complaint.system.service;

import com.complaint.system.dto.DepartmentRequest;
import com.complaint.system.dto.DepartmentResponse;

import java.util.List;

public interface DepartmentService {

    DepartmentResponse createDepartment(
            DepartmentRequest request
    );

    List<DepartmentResponse> getAllDepartments();

    List<DepartmentResponse> getActiveDepartments();

    DepartmentResponse getDepartmentById(
            Long id
    );

    DepartmentResponse updateDepartment(
            Long id,
            DepartmentRequest request
    );

    void deactivateDepartment(
            Long id
    );

    DepartmentResponse activateDepartment(Long id);
}