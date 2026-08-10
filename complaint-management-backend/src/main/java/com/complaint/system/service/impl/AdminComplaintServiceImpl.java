package com.complaint.system.service.impl;

import com.complaint.system.dto.AdminComplaintResponse;
import com.complaint.system.dto.AdminDashboardStatsResponse;
import com.complaint.system.entity.Complaint;
import com.complaint.system.enums.ComplaintStatus;
import com.complaint.system.enums.Priority;
import com.complaint.system.exception.ResourceNotFoundException;
import com.complaint.system.repository.ComplaintRepository;
import com.complaint.system.service.AdminComplaintService;
import com.complaint.system.service.SlaService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminComplaintServiceImpl
        implements AdminComplaintService {

    private final ComplaintRepository complaintRepository;
    private final SlaService slaService;

    // ==========================================
    // GET ALL COMPLAINTS
    // WITH PAGINATION + SORTING
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public Page<AdminComplaintResponse> getAllComplaints(
            Pageable pageable) {

        return complaintRepository
                .findAll(pageable)
                .map(this::mapToResponse);
    }

    // ==========================================
    // GET SINGLE COMPLAINT
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public AdminComplaintResponse getComplaint(
            String complaintNumber) {

        Complaint complaint =
                complaintRepository
                        .findByComplaintNumber(complaintNumber)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Complaint not found"
                                )
                        );

        return mapToResponse(complaint);
    }

    // ==========================================
    // FILTER BY STATUS
    // WITH PAGINATION + SORTING
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public Page<AdminComplaintResponse> getComplaintsByStatus(
            ComplaintStatus status,
            Pageable pageable) {

        return complaintRepository
                .findByStatus(status, pageable)
                .map(this::mapToResponse);
    }

    // ==========================================
    // FILTER BY PRIORITY
    // WITH PAGINATION + SORTING
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public Page<AdminComplaintResponse> getComplaintsByPriority(
            Priority priority,
            Pageable pageable) {

        return complaintRepository
                .findByPriority(priority, pageable)
                .map(this::mapToResponse);
    }

    // ==========================================
    // FILTER BY DEPARTMENT
    // WITH PAGINATION + SORTING
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public Page<AdminComplaintResponse> getComplaintsByDepartment(
            Long departmentId,
            Pageable pageable) {

        return complaintRepository
                .findByDepartmentId(
                        departmentId,
                        pageable
                )
                .map(this::mapToResponse);
    }

    // ==========================================
    // COMBINED FILTERS
    // STATUS + PRIORITY + DEPARTMENT
    // WITH PAGINATION + SORTING
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public Page<AdminComplaintResponse> filterComplaints(
            ComplaintStatus status,
            Priority priority,
            Long departmentId,
            Pageable pageable) {

        Specification<Complaint> specification =
                (root, query, criteriaBuilder) ->
                        criteriaBuilder.conjunction();

        // STATUS FILTER
        if (status != null) {

            specification =
                    specification.and(
                            (root, query, criteriaBuilder) ->
                                    criteriaBuilder.equal(
                                            root.get("status"),
                                            status
                                    )
                    );
        }

        // PRIORITY FILTER
        if (priority != null) {

            specification =
                    specification.and(
                            (root, query, criteriaBuilder) ->
                                    criteriaBuilder.equal(
                                            root.get("priority"),
                                            priority
                                    )
                    );
        }

        // DEPARTMENT FILTER
        if (departmentId != null) {

            specification =
                    specification.and(
                            (root, query, criteriaBuilder) ->
                                    criteriaBuilder.equal(
                                            root.get("department")
                                                    .get("id"),
                                            departmentId
                                    )
                    );
        }

        return complaintRepository
                .findAll(
                        specification,
                        pageable
                )
                .map(this::mapToResponse);
    }

    // ==========================================
    // ENTITY → RESPONSE
    // ==========================================

    private AdminComplaintResponse mapToResponse(
            Complaint complaint) {

        Long userId = null;
        String userName = null;
        String userEmail = null;

        // USER
        if (complaint.getUser() != null) {

            userId =
                    complaint.getUser().getId();

            userName =
                    complaint.getUser().getName();

            userEmail =
                    complaint.getUser().getEmail();
        }

        // DEPARTMENT
        Long departmentId = null;
        String departmentName = null;

        if (complaint.getDepartment() != null) {

            departmentId =
                    complaint.getDepartment().getId();

            departmentName =
                    complaint.getDepartment().getName();
        }

        // ASSIGNED STAFF
        Long staffId = null;
        String staffName = null;

        if (complaint.getAssignedStaff() != null) {

            staffId =
                    complaint.getAssignedStaff().getId();

            staffName =
                    complaint.getAssignedStaff().getName();
        }

        return AdminComplaintResponse.builder()

                .id(
                        complaint.getId()
                )

                .complaintNumber(
                        complaint.getComplaintNumber()
                )

                .title(
                        complaint.getTitle()
                )

                .description(
                        complaint.getDescription()
                )

                .category(
                        complaint.getCategory()
                )

                .priority(
                        complaint.getPriority()
                )

                .status(
                        complaint.getStatus()
                )

                .location(
                        complaint.getLocation()
                )

                .userId(
                        userId
                )

                .userName(
                        userName
                )

                .userEmail(
                        userEmail
                )

                .departmentId(
                        departmentId
                )

                .departmentName(
                        departmentName
                )

                .assignedStaffId(
                        staffId
                )

                .assignedStaffName(
                        staffName
                )

                .slaDeadline(
                        complaint.getSlaDeadline()
                )

                .overdue(
                        slaService.isOverdue(
                                complaint.getSlaDeadline()
                        )
                )

                .resolvedAt(
                        complaint.getResolvedAt()
                )

                .closedAt(
                        complaint.getClosedAt()
                )

                .createdAt(
                        complaint.getCreatedAt()
                )

                .updatedAt(
                        complaint.getUpdatedAt()
                )

                .build();
    }

    // ==========================================
    // GET OVERDUE COMPLAINTS
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public List<AdminComplaintResponse> getOverdueComplaints() {

        return complaintRepository
                .findAll()
                .stream()
                .filter(complaint ->
                        slaService.isOverdue(
                                complaint.getSlaDeadline()
                        )
                )
                .map(this::mapToResponse)
                .toList();
    }

    // ==========================================
    // DASHBOARD STATISTICS
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardStatsResponse getDashboardStats() {

        List<Complaint> complaints =
                complaintRepository.findAll();

        long total = complaints.size();

        long submitted = complaints.stream()
                .filter(c ->
                        c.getStatus()
                                == ComplaintStatus.SUBMITTED
                )
                .count();

        long assigned = complaints.stream()
                .filter(c ->
                        c.getStatus()
                                == ComplaintStatus.ASSIGNED
                )
                .count();

        long inProgress = complaints.stream()
                .filter(c ->
                        c.getStatus()
                                == ComplaintStatus.IN_PROGRESS
                )
                .count();

        long resolved = complaints.stream()
                .filter(c ->
                        c.getStatus()
                                == ComplaintStatus.RESOLVED
                )
                .count();

        long closed = complaints.stream()
                .filter(c ->
                        c.getStatus()
                                == ComplaintStatus.CLOSED
                )
                .count();

        long highPriority = complaints.stream()
                .filter(c ->
                        c.getPriority()
                                == Priority.HIGH
                )
                .count();

        long overdue = complaints.stream()
                .filter(c ->
                        slaService.isOverdue(
                                c.getSlaDeadline()
                        )
                )
                .count();

        return AdminDashboardStatsResponse.builder()

                .totalComplaints(total)

                .submitted(submitted)

                .assigned(assigned)

                .inProgress(inProgress)

                .resolved(resolved)

                .closed(closed)

                .highPriority(highPriority)

                .overdue(overdue)

                .build();
    }
}