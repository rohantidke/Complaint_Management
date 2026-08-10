import axiosClient from "./axiosClient";

export const login = async (data) => {
  const response = await axiosClient.post(
    "/api/auth/login",
    data
  );

  return response.data;
};

export const register = async (data) => {
  const response = await axiosClient.post(
    "/api/auth/register",
    data
  );

  return response.data;
};

// ==========================================
// FORGOT PASSWORD
// ==========================================

export const forgotPassword = async (email) => {
  const response = await axiosClient.post(
    "/api/auth/forgot-password",
    {
      email,
    }
  );

  return response.data;
};

// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPassword = async (
  token,
  password,
  confirmPassword
) => {
  const response = await axiosClient.post(
    "/api/auth/reset-password",
    {
      token,
      password,
      confirmPassword,
    }
  );

  return response.data;
};