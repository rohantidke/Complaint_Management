package com.complaint.system.service.impl;

import com.complaint.system.dto.DepartmentRequest;
import com.complaint.system.dto.DepartmentResponse;
import com.complaint.system.entity.Department;
import com.complaint.system.exception.BadRequestException;
import com.complaint.system.exception.ResourceNotFoundException;
import com.complaint.system.repository.DepartmentRepository;
import com.complaint.system.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl
        implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional
    public DepartmentResponse createDepartment(
            DepartmentRequest request) {

        if (departmentRepository.existsByName(
                request.getName())) {

            throw new BadRequestException(
                    "Department already exists"
            );
        }

        Department department = Department.builder()
                .name(request.getName())
                .description(request.getDescription())
                .active(true)
                .build();

        department =
                departmentRepository.save(department);

        return mapToResponse(department);
    }

    @Override
    public List<DepartmentResponse>
    getAllDepartments() {

        return departmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<DepartmentResponse>
    getActiveDepartments() {

        return departmentRepository
                .findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public DepartmentResponse getDepartmentById(
            Long id) {

        Department department =
                departmentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Department not found"
                                )
                        );

        return mapToResponse(department);
    }

    @Override
    @Transactional
    public DepartmentResponse updateDepartment(
            Long id,
            DepartmentRequest request) {

        Department department =
                departmentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Department not found"
                                )
                        );

        if (!department.getName()
                .equals(request.getName())
                &&
                departmentRepository.existsByName(
                        request.getName())) {

            throw new BadRequestException(
                    "Department name already exists"
            );
        }

        department.setName(request.getName());

        department.setDescription(
                request.getDescription()
        );

        department =
                departmentRepository.save(department);

        return mapToResponse(department);
    }

    @Override
    @Transactional
    public void deactivateDepartment(
            Long id) {

        Department department =
                departmentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Department not found"
                                )
                        );

        department.setActive(false);

        departmentRepository.save(department);
    }

    private DepartmentResponse mapToResponse(
            Department department) {

        return DepartmentResponse.builder()
                .id(department.getId())
                .name(department.getName())
                .description(
                        department.getDescription()
                )
                .active(department.getActive())
                .createdAt(
                        department.getCreatedAt()
                )
                .updatedAt(
                        department.getUpdatedAt()
                )
                .build();
    }

    @Override
@Transactional
public DepartmentResponse activateDepartment(Long id) {

    Department department =
            departmentRepository.findById(id)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Department not found"
                            )
                    );

    department.setActive(true);

    Department saved =
            departmentRepository.save(department);

    return mapToResponse(saved);
}
}