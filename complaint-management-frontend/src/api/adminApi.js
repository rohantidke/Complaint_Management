import axiosClient from "./axiosClient";

export const getDashboardStats = async () => {
  const response = await axiosClient.get(
    "/api/admin/dashboard/stats"
  );

  return response.data;
};

export const getAdminComplaints = async ({
  page = 0,
  size = 10,
  status,
  priority,
  departmentId,
  sort = "createdAt,desc",
} = {}) => {
  const params = {
    page,
    size,
    sort,
  };

  if (status) {
    params.status = status;
  }

  if (priority) {
    params.priority = priority;
  }

  if (departmentId) {
    params.departmentId = departmentId;
  }

  const response = await axiosClient.get(
    "/api/admin/complaints",
    {
      params,
    }
  );

  return response.data;
};

export const getOverdueComplaints = async () => {
  const response = await axiosClient.get(
    "/api/admin/complaints/overdue"
  );

  return response.data;
};

export const getAdminComplaint = async (complaintNumber) => {
  const response = await axiosClient.get(
    `/api/admin/complaints/${complaintNumber}`
  );

  return response.data;
};

export const getAdminComplaintHistory = async (
  complaintNumber
) => {
  const response = await axiosClient.get(
    `/api/admin/complaints/${complaintNumber}/history`
  );

  return response.data;
};

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