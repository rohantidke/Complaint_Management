
package com.complaint.system.service;

import com.complaint.system.dto.AdminComplaintResponse;
import com.complaint.system.dto.AdminDashboardStatsResponse;
import com.complaint.system.enums.ComplaintStatus;
import com.complaint.system.enums.Priority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface AdminComplaintService {


    List<AdminComplaintResponse> getOverdueComplaints();

    AdminDashboardStatsResponse getDashboardStats();


    // Get all complaints with pagination and sorting
    Page<AdminComplaintResponse> getAllComplaints(
            Pageable pageable
    );
    

    // Get single complaint
    AdminComplaintResponse getComplaint(
            String complaintNumber
    );

    // Filter complaints by status
    Page<AdminComplaintResponse> getComplaintsByStatus(
            ComplaintStatus status,
            Pageable pageable
    );

    // Filter complaints by priority
    Page<AdminComplaintResponse> getComplaintsByPriority(
            Priority priority,
            Pageable pageable
    );

    // Filter complaints by department
    Page<AdminComplaintResponse> getComplaintsByDepartment(
            Long departmentId,
            Pageable pageable
    );

    // Combined filters
    Page<AdminComplaintResponse> filterComplaints(
            ComplaintStatus status,
            Priority priority,
            Long departmentId,
            Pageable pageable
    );
}

