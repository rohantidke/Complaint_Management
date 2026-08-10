import axiosClient from "./axiosClient";

/* =========================================================
   USER COMPLAINTS
   ========================================================= */

/**
 * Create a new complaint
 */
export const createComplaint = async (data) => {
  const response = await axiosClient.post(
    "/api/complaints",
    data
  );

  return response.data;
};


/**
 * Get complaints created by logged-in user
 */
export const getMyComplaints = async () => {
  const response = await axiosClient.get(
    "/api/complaints/my"
  );

  return response.data;
};


/**
 * Get one complaint by complaint number
 */
export const getComplaint = async (complaintNumber) => {
  const response = await axiosClient.get(
    `/api/complaints/${complaintNumber}`
  );

  return response.data;
};


/**
 * Get complaint history
 */
export const getComplaintHistory = async (
  complaintNumber
) => {
  const response = await axiosClient.get(
    `/api/complaints/${complaintNumber}/history`
  );

  return response.data;
};


/* =========================================================
   STAFF COMPLAINTS
   ========================================================= */

/**
 * Get complaints assigned to logged-in staff
 */
export const getAssignedComplaints = async () => {
  const response = await axiosClient.get(
    "/api/staff/complaints"
  );

  return response.data;
};


/**
 * Start assigned complaint
 */
export const startComplaint = async (
  complaintNumber
) => {
  const response = await axiosClient.put(
    `/api/staff/complaints/${complaintNumber}/start`
  );

  return response.data;
};


/**
 * Resolve assigned complaint
 */
export const resolveComplaint = async (
  complaintNumber
) => {
  const response = await axiosClient.put(
    `/api/staff/complaints/${complaintNumber}/resolve`
  );

  return response.data;
};


/* =========================================================
   ADMIN COMPLAINTS
   ========================================================= */

/**
 * Assign complaint to staff
 */
export const assignComplaint = async (
  complaintNumber,
  data
) => {
  const response = await axiosClient.put(
    `/api/admin/complaints/${complaintNumber}/assign`,
    data
  );

  return response.data;
};