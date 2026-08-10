
package com.complaint.system.service;

import com.complaint.system.dto.ComplaintAssignmentRequest;
import com.complaint.system.dto.ComplaintAssignmentResponse;
import com.complaint.system.dto.ComplaintHistoryResponse;
import com.complaint.system.dto.ComplaintRequest;
import com.complaint.system.dto.ComplaintResponse;
import com.complaint.system.dto.StaffComplaintResponse;

import java.util.List;

public interface ComplaintService {

    // USER COMPLAINT APIs

    ComplaintResponse createComplaint(
            ComplaintRequest request,
            String userEmail
    );

    List<ComplaintResponse> getMyComplaints(
            String userEmail
    );

    ComplaintResponse getComplaintByNumber(
            String complaintNumber,
            String userEmail
    );

    List<ComplaintHistoryResponse> getComplaintHistory(
            String complaintNumber,
            String userEmail
    );

    // ADMIN APIs

    ComplaintAssignmentResponse assignComplaint(
            String complaintNumber,
            ComplaintAssignmentRequest request,
            String adminEmail
    );

    List<ComplaintHistoryResponse> getComplaintHistoryForAdmin(
            String complaintNumber
    );

    // STAFF APIs

    List<StaffComplaintResponse> getAssignedComplaints(
            String staffEmail
    );

    StaffComplaintResponse startComplaint(
            String complaintNumber,
            String staffEmail
    );

    StaffComplaintResponse resolveComplaint(
            String complaintNumber,
            String staffEmail
    );
}

