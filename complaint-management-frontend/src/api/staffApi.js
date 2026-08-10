import axiosClient from "./axiosClient";

export const getAllStaff = async () => {
  const response = await axiosClient.get(
    "/api/admin/staff"
  );

  return response.data;
};

export const getStaffByDepartment = async (departmentId) => {
  const response = await axiosClient.get(
    `/api/admin/staff/department/${departmentId}`
  );

  return response.data;
};

export const getStaffById = async (id) => {
  const response = await axiosClient.get(
    `/api/admin/staff/${id}`
  );

  return response.data;
};

export const createStaff = async (data) => {
  const response = await axiosClient.post(
    "/api/admin/staff",
    data
  );

  return response.data;
};

export const updateStaff = async (id, data) => {
  const response = await axiosClient.put(
    `/api/admin/staff/${id}`,
    data
  );

  return response.data;
};

export const deactivateStaff = async (id) => {
  const response = await axiosClient.delete(
    `/api/admin/staff/${id}`
  );

  return response.data;
};

export const getAssignedComplaints = async () => {
  const response = await axiosClient.get(
    "/api/staff/complaints"
  );

  return response.data;
};

export const startComplaint = async (complaintNumber) => {
  const response = await axiosClient.put(
    `/api/staff/complaints/${complaintNumber}/start`
  );

  return response.data;
};

export const resolveComplaint = async (complaintNumber) => {
  const response = await axiosClient.put(
    `/api/staff/complaints/${complaintNumber}/resolve`
  );

  return response.data;
};

export const activateStaff = async (id) => {
  const response = await axiosClient.put(
    `/api/admin/staff/${id}/activate`
  );

  return response.data;
};