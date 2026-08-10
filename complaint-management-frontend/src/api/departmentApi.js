import axiosClient from "./axiosClient";

export const getDepartments = async () => {
  const response = await axiosClient.get(
    "/api/admin/departments"
  );

  return response.data;
};

export const getActiveDepartments = async () => {
  const response = await axiosClient.get(
    "/api/admin/departments/active"
  );

  return response.data;
};


export const activateDepartment = async (id) => {
  const response = await axiosClient.put(
    `/api/admin/departments/${id}/activate`
  );

  return response.data;
};

export const getDepartment = async (id) => {
  const response = await axiosClient.get(
    `/api/admin/departments/${id}`
  );

  return response.data;
};

export const createDepartment = async (data) => {
  const response = await axiosClient.post(
    "/api/admin/departments",
    data
  );

  return response.data;
};

export const updateDepartment = async (id, data) => {
  const response = await axiosClient.put(
    `/api/admin/departments/${id}`,
    data
  );

  return response.data;
};

export const deactivateDepartment = async (id) => {
  const response = await axiosClient.delete(
    `/api/admin/departments/${id}`
  );

  return response.data;
};