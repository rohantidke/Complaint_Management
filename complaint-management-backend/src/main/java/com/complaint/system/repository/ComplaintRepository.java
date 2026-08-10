
package com.complaint.system.repository;

import com.complaint.system.entity.Complaint;
import com.complaint.system.enums.ComplaintStatus;
import com.complaint.system.enums.Priority;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface ComplaintRepository
        extends JpaRepository<Complaint, Long>,
                JpaSpecificationExecutor<Complaint> {

    // ==========================================
    // FIND BY COMPLAINT NUMBER
    // ==========================================

    Optional<Complaint> findByComplaintNumber(
            String complaintNumber
    );


    // ==========================================
    // USER COMPLAINTS
    // ==========================================

    List<Complaint> findByUserId(
            Long userId
    );


    // ==========================================
    // STAFF COMPLAINTS
    // ==========================================

    List<Complaint> findByAssignedStaffId(
            Long staffId
    );


    // ==========================================
    // DEPARTMENT
    // ==========================================

    List<Complaint> findByDepartmentId(
            Long departmentId
    );


    // ==========================================
    // STATUS
    // ==========================================

    List<Complaint> findByStatus(
            ComplaintStatus status
    );


    // ==========================================
    // PRIORITY
    // ==========================================

    List<Complaint> findByPriority(
            Priority priority
    );


    // ==========================================
    // PAGINATION + SORTING
    // ==========================================

    Page<Complaint> findByStatus(
            ComplaintStatus status,
            Pageable pageable
    );

    Page<Complaint> findByPriority(
            Priority priority,
            Pageable pageable
    );

    Page<Complaint> findByDepartmentId(
            Long departmentId,
            Pageable pageable
    );


    // ==========================================
    // COMPLAINT NUMBER EXISTS
    // ==========================================

    boolean existsByComplaintNumber(
            String complaintNumber
    );


    // ==========================================
    // STAFF + STATUS
    // ==========================================

    List<Complaint> findByAssignedStaffIdAndStatus(
            Long staffId,
            ComplaintStatus status
    );
}

