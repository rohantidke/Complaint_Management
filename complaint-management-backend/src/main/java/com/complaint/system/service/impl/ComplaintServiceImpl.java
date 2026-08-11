package com.complaint.system.service.impl;

import com.complaint.system.dto.ComplaintAssignmentRequest;
import com.complaint.system.dto.ComplaintAssignmentResponse;
import com.complaint.system.dto.ComplaintHistoryResponse;
import com.complaint.system.dto.ComplaintRequest;
import com.complaint.system.dto.ComplaintResponse;
import com.complaint.system.dto.StaffComplaintResponse;
import com.complaint.system.entity.Complaint;
import com.complaint.system.entity.ComplaintHistory;
import com.complaint.system.entity.Department;
import com.complaint.system.entity.User;
import com.complaint.system.enums.ComplaintStatus;
import com.complaint.system.enums.Role;
import com.complaint.system.exception.ResourceNotFoundException;
import com.complaint.system.exception.UnauthorizedException;
import com.complaint.system.repository.ComplaintHistoryRepository;
import com.complaint.system.repository.ComplaintRepository;
import com.complaint.system.repository.DepartmentRepository;
import com.complaint.system.repository.UserRepository;
import com.complaint.system.service.ComplaintService;
import com.complaint.system.util.ComplaintNumberGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;

import com.complaint.system.service.SlaService;
import com.complaint.system.service.NotificationService;
import com.complaint.system.exception.BadRequestException;


import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintHistoryRepository complaintHistoryRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final ComplaintNumberGenerator complaintNumberGenerator;
    private final SlaService slaService;
    private final NotificationService notificationService;



    private boolean canViewComplaint(
        User currentUser,
        Complaint complaint) {

    // ADMIN can view any complaint
    if (currentUser.getRole() == Role.ADMIN) {
        return true;
    }

    // USER can view their own complaint
    if (currentUser.getRole() == Role.USER) {

        return complaint.getUser() != null
                && complaint.getUser()
                        .getId()
                        .equals(currentUser.getId());
    }

    // STAFF can view complaints assigned to them
    if (currentUser.getRole() == Role.STAFF) {

        return complaint.getAssignedStaff() != null
                && complaint.getAssignedStaff()
                        .getId()
                        .equals(currentUser.getId());
    }

    return false;
}


// =========================================================
// USER - CREATE COMPLAINT
// =========================================================

@Override
@Transactional
public ComplaintResponse createComplaint(
        ComplaintRequest request,
        String userEmail) {

    User user =
            userRepository
                    .findByEmail(userEmail)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "User not found"
                            )
                    );

    String complaintNumber =
            complaintNumberGenerator.generate();
            
Complaint complaint = Complaint.builder()
        .complaintNumber(complaintNumber)
        .title(request.getTitle())
        .description(request.getDescription())
        .category(request.getCategory())
        .priority(request.getPriority())
        .location(request.getLocation())
        .status(ComplaintStatus.SUBMITTED)
        .user(user)
        .slaDeadline(LocalDateTime.now().plusHours(24))
        .build();

    complaint =
            complaintRepository.save(complaint);

    // Create initial history
    ComplaintHistory history =
            ComplaintHistory.builder()
                    .complaint(complaint)
                    .oldStatus(null)
                    .newStatus(
                            ComplaintStatus.SUBMITTED
                    )
                    .comment(
                            "Complaint submitted successfully"
                    )
                    .changedBy(user)
                    .build();

    complaintHistoryRepository.save(history);

    return mapToResponse(complaint);
}


// =========================================================
// USER - GET MY COMPLAINTS
// =========================================================

@Override
@Transactional(readOnly = true)
public List<ComplaintResponse> getMyComplaints(
        String userEmail) {

    User user =
            userRepository
                    .findByEmail(userEmail)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "User not found"
                            )
                    );

    return complaintRepository
            .findByUserId(user.getId())
            .stream()
            .map(this::mapToResponse)
            .toList();
}


// =========================================================
// USER - GET SINGLE COMPLAINT
// =========================================================

@Override
@Transactional(readOnly = true)
public ComplaintResponse getComplaintByNumber(
        String complaintNumber,
        String userEmail) {

    User currentUser =
            userRepository
                    .findByEmail(userEmail)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "User not found"
                            )
                    );

    Complaint complaint =
            complaintRepository
                    .findByComplaintNumber(
                            complaintNumber
                    )
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Complaint not found"
                            )
                    );

    if (!canViewComplaint(
            currentUser,
            complaint)) {

        throw new UnauthorizedException(
                "You are not authorized to view this complaint"
        );
    }

    return mapToResponse(complaint);
}


// =========================================================
// USER - COMPLAINT HISTORY
// =========================================================

@Override
@Transactional(readOnly = true)
public List<ComplaintHistoryResponse>
getComplaintHistory(
        String complaintNumber,
        String userEmail) {

    User currentUser =
            userRepository
                    .findByEmail(userEmail)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "User not found"
                            )
                    );

    Complaint complaint =
            complaintRepository
                    .findByComplaintNumber(
                            complaintNumber
                    )
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Complaint not found"
                            )
                    );

    if (!canViewComplaint(
            currentUser,
            complaint)) {

        throw new UnauthorizedException(
                "You are not authorized to view this complaint"
        );
    }

    return complaintHistoryRepository
            .findByComplaintIdOrderByCreatedAtAsc(
                    complaint.getId()
            )
            .stream()
            .map(history ->
                    ComplaintHistoryResponse.builder()
                            .oldStatus(
                                    history.getOldStatus()
                            )
                            .newStatus(
                                    history.getNewStatus()
                            )
                            .comment(
                                    history.getComment()
                            )
                            .changedBy(
                                    history.getChangedBy() != null
                                            ? history
                                                    .getChangedBy()
                                                    .getName()
                                            : "System"
                            )
                            .createdAt(
                                    history.getCreatedAt()
                            )
                            .build()
            )
            .toList();
}

    // =========================================================
    // ADMIN - ASSIGN COMPLAINT
    // =========================================================
// =========================================================
// ADMIN - ASSIGN COMPLAINT
// =========================================================
@Override
@Transactional
public ComplaintAssignmentResponse assignComplaint(
String complaintNumber,
ComplaintAssignmentRequest request,
String adminEmail) {

// =========================
// FIND COMPLAINT
// =========================

Complaint complaint =
        complaintRepository
                .findByComplaintNumber(complaintNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Complaint not found"
                        )
                );

// =========================
// FIND DEPARTMENT
// =========================

Department department =
        departmentRepository
                .findById(request.getDepartmentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found"
                        )
                );

if (!Boolean.TRUE.equals(department.getActive())) {

    throw new BadRequestException(
            "Department is inactive"
    );
}

// =========================
// FIND STAFF
// =========================

User staff =
        userRepository
                .findById(request.getStaffId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Staff member not found"
                        )
                );

if (staff.getRole() != Role.STAFF) {

    throw new BadRequestException(
            "Selected user is not a staff member"
    );
}

if (!Boolean.TRUE.equals(staff.getEnabled())) {

    throw new BadRequestException(
            "Staff member is inactive"
    );
}

// =========================
// VERIFY STAFF DEPARTMENT
// =========================

if (staff.getDepartment() == null
        || !staff.getDepartment()
                .getId()
                .equals(department.getId())) {

    throw new BadRequestException(
            "Staff does not belong to selected department"
    );
}

// =========================
// FIND ADMIN
// =========================

User admin =
        userRepository
                .findByEmail(adminEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Admin user not found"
                        )
                );

if (admin.getRole() != Role.ADMIN) {

    throw new UnauthorizedException(
            "Only an admin can assign complaints"
    );
}

// =========================
// SAVE OLD STATUS
// =========================

ComplaintStatus oldStatus =
        complaint.getStatus();

// =========================
// ASSIGN COMPLAINT
// =========================

complaint.setDepartment(department);
complaint.setAssignedStaff(staff);
complaint.setStatus(ComplaintStatus.ASSIGNED);

Complaint savedComplaint =
        complaintRepository.save(complaint);

// =========================
// CREATE HISTORY
// =========================

ComplaintHistory history =
        ComplaintHistory.builder()
                .complaint(savedComplaint)
                .oldStatus(oldStatus)
                .newStatus(ComplaintStatus.ASSIGNED)
                .comment(
                        "Complaint assigned to "
                                + staff.getName()
                                + " from department "
                                + department.getName()
                )
                .changedBy(admin)
                .build();

complaintHistoryRepository.save(history);

// =========================
// NOTIFICATION TO STAFF
// =========================

notificationService.createNotification(
        staff,
        "Complaint "
                + savedComplaint.getComplaintNumber()
                + " has been assigned to you."
);

// =========================
// NOTIFICATION TO USER
// =========================

User complaintUser =
        savedComplaint.getUser();

if (complaintUser != null) {

    notificationService.createNotification(
            complaintUser,
            "Your complaint "
                    + savedComplaint.getComplaintNumber()
                    + " has been assigned to "
                    + staff.getName()
                    + " from the "
                    + department.getName()
                    + " department."
    );
}

// =========================
// RESPONSE
// =========================

return ComplaintAssignmentResponse.builder()
        .complaintNumber(
                savedComplaint.getComplaintNumber()
        )
        .status(
                savedComplaint.getStatus()
        )
        .departmentId(
                department.getId()
        )
        .departmentName(
                department.getName()
        )
        .staffId(
                staff.getId()
        )
        .staffName(
                staff.getName()
        )
        .message(
                "Complaint assigned successfully"
        )
        .build();

}


// =========================================================
// ADMIN - GET COMPLAINT HISTORY
// =========================================================

@Override
@Transactional(readOnly = true)
public List<ComplaintHistoryResponse>
getComplaintHistoryForAdmin(
        String complaintNumber) {

    Complaint complaint =
            complaintRepository
                    .findByComplaintNumber(
                            complaintNumber
                    )
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Complaint not found"
                            )
                    );

    return complaintHistoryRepository
            .findByComplaintIdOrderByCreatedAtAsc(
                    complaint.getId()
            )
            .stream()
            .map(history ->
                    ComplaintHistoryResponse.builder()
                            .oldStatus(
                                    history.getOldStatus()
                            )
                            .newStatus(
                                    history.getNewStatus()
                            )
                            .comment(
                                    history.getComment()
                            )
                            .changedBy(
                                    history.getChangedBy() != null
                                            ? history
                                                    .getChangedBy()
                                                    .getName()
                                            : "System"
                            )
                            .createdAt(
                                    history.getCreatedAt()
                            )
                            .build()
            )
            .toList();
}


// =========================================================
// STAFF - GET ASSIGNED COMPLAINTS
// =========================================================

@Override
@Transactional(readOnly = true)
public List<StaffComplaintResponse>
getAssignedComplaints(
        String staffEmail) {

    User staff =
            userRepository
                    .findByEmail(staffEmail)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Staff not found"
                            )
                    );

    if (staff.getRole() != Role.STAFF) {

        throw new BadRequestException(
                "User is not a staff member"
        );
    }

    return complaintRepository
            .findByAssignedStaffId(
                    staff.getId()
            )
            .stream()
            .map(this::mapToStaffResponse)
            .toList();
}


// =========================================================
// STAFF - START COMPLAINT
// =========================================================

@Override
@Transactional
public StaffComplaintResponse startComplaint(
        String complaintNumber,
        String staffEmail) {

    User staff =
            userRepository
                    .findByEmail(staffEmail)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Staff not found"
                            )
                    );

    if (staff.getRole() != Role.STAFF) {

        throw new BadRequestException(
                "User is not a staff member"
        );
    }

    Complaint complaint =
            complaintRepository
                    .findByComplaintNumber(
                            complaintNumber
                    )
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Complaint not found"
                            )
                    );

    // Security check
    if (complaint.getAssignedStaff() == null
            || !complaint
                    .getAssignedStaff()
                    .getId()
                    .equals(staff.getId())) {

        throw new UnauthorizedException(
                "Complaint is not assigned to you"
        );
    }

    // Status check
    if (complaint.getStatus()
            != ComplaintStatus.ASSIGNED) {

        throw new BadRequestException(
                "Only ASSIGNED complaints can be started"
        );
    }

    ComplaintStatus oldStatus =
            complaint.getStatus();

    complaint.setStatus(
            ComplaintStatus.IN_PROGRESS
    );

    complaintRepository.save(complaint);

    // History
    ComplaintHistory history =
            ComplaintHistory.builder()
                    .complaint(complaint)
                    .oldStatus(oldStatus)
                    .newStatus(
                            ComplaintStatus.IN_PROGRESS
                    )
                    .comment(
                            "Staff started working on complaint"
                    )
                    .changedBy(staff)
                    .build();

    complaintHistoryRepository.save(history);

    return mapToStaffResponse(complaint);
}


    // =========================================================
    // STAFF - RESOLVE COMPLAINT
    // =========================================================
@Override
@Transactional
public StaffComplaintResponse resolveComplaint(
        String complaintNumber,
        String staffEmail) {

    // =========================
    // FIND STAFF
    // =========================

    User staff =
            userRepository
                    .findByEmail(staffEmail)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Staff not found"
                            )
                    );

    // =========================
    // VERIFY STAFF ROLE
    // =========================

    if (staff.getRole() != Role.STAFF) {

        throw new BadRequestException(
                "User is not a staff member"
        );
    }

    // =========================
    // FIND COMPLAINT
    // =========================

    Complaint complaint =
            complaintRepository
                    .findByComplaintNumber(
                            complaintNumber
                    )
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Complaint not found"
                            )
                    );

    // =========================
    // SECURITY CHECK
    // =========================

    if (complaint.getAssignedStaff() == null
            || !complaint.getAssignedStaff()
                    .getId()
                    .equals(staff.getId())) {

        throw new UnauthorizedException(
                "Complaint is not assigned to you"
        );
    }

    // =========================
    // STATUS CHECK
    // =========================

    if (complaint.getStatus()
            != ComplaintStatus.IN_PROGRESS) {

        throw new BadRequestException(
                "Only IN_PROGRESS complaints can be resolved"
        );
    }

    // =========================
    // SAVE OLD STATUS
    // =========================

    ComplaintStatus oldStatus =
            complaint.getStatus();

    // =========================
    // UPDATE COMPLAINT
    // =========================

    complaint.setStatus(
            ComplaintStatus.RESOLVED
    );

    complaint.setResolvedAt(
            LocalDateTime.now()
    );

    Complaint savedComplaint =
            complaintRepository.save(complaint);

    // =========================
    // HISTORY
    // =========================

    ComplaintHistory history =
            ComplaintHistory.builder()
                    .complaint(savedComplaint)
                    .oldStatus(oldStatus)
                    .newStatus(
                            ComplaintStatus.RESOLVED
                    )
                    .comment(
                            "Complaint resolved by staff"
                    )
                    .changedBy(staff)
                    .build();

    complaintHistoryRepository.save(history);

    // =========================
    // ADMIN NOTIFICATION
    // =========================

    User admin =
            userRepository
                    .findFirstByRole(Role.ADMIN)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Admin user not found"
                            )
                    );

    notificationService.createNotification(
            admin,
            "Complaint "
                    + savedComplaint.getComplaintNumber()
                    + " has been resolved by "
                    + staff.getName()
                    + "."
    );

    // =========================
    // RETURN RESPONSE
    // =========================

    return mapToStaffResponse(
            savedComplaint
    );
}

// =========================================================
// COMMON - COMPLAINT RESPONSE MAPPER
// =========================================================

private ComplaintResponse mapToResponse(
        Complaint complaint) {

    String department =
            complaint.getDepartment() != null
                    ? complaint.getDepartment()
                            .getName()
                    : null;

    String assignedStaff =
            complaint.getAssignedStaff() != null
                    ? complaint.getAssignedStaff()
                            .getName()
                    : null;

    return ComplaintResponse.builder()
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
            .department(
                    department
            )
            .assignedStaff(
                    assignedStaff
            )
            .slaDeadline(
                    complaint.getSlaDeadline()
            )
            .createdAt(
                    complaint.getCreatedAt()
            )
            .updatedAt(
                    complaint.getUpdatedAt()
            )
            .build();
}


// =========================================================
// COMMON - STAFF RESPONSE MAPPER
// =========================================================

private StaffComplaintResponse mapToStaffResponse(
        Complaint complaint) {

    String department =
            complaint.getDepartment() != null
                    ? complaint.getDepartment()
                            .getName()
                    : null;

    String assignedStaff =
            complaint.getAssignedStaff() != null
                    ? complaint.getAssignedStaff()
                            .getName()
                    : null;

    return StaffComplaintResponse.builder()
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
            .department(
                    department
            )
            .assignedStaff(
                    assignedStaff
            )
            .slaDeadline(
                    complaint.getSlaDeadline()
            )
            .createdAt(
                    complaint.getCreatedAt()
            )
            .updatedAt(
                    complaint.getUpdatedAt()
            )
            .resolvedAt(
                    complaint.getResolvedAt()
            )
            .build();
}
}