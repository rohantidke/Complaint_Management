import axiosClient from "./axiosClient";

// Get user's complaints
export const getMyComplaints = async ({
  page = 0,
  size = 10,
  sort = "createdAt,desc",
} = {}) => {
  const response = await axiosClient.get(
    "/api/user/complaints",
    {
      params: {
        page,
        size,
        sort,
      },
    }
  );

  return response.data;
};

// Get a single complaint
export const getMyComplaint = async (
  complaintNumber
) => {
  const response = await axiosClient.get(
    `/api/user/complaints/${complaintNumber}`
  );

  return response.data;
};

// Get complaint history
export const getMyComplaintHistory = async (
  complaintNumber
) => {
  const response = await axiosClient.get(
    `/api/user/complaints/${complaintNumber}/history`
  );

  return response.data;
};