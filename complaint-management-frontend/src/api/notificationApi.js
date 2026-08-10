import axiosClient from "./axiosClient";

export const getMyNotifications = async () => {
  const response = await axiosClient.get(
    "/api/notifications"
  );

  return response.data;
};

export const getUnreadCount = async () => {
  const response = await axiosClient.get(
    "/api/notifications/unread-count"
  );

  return response.data;
};

export const markAsRead = async (
  notificationId
) => {
  const response = await axiosClient.put(
    `/api/notifications/${notificationId}/read`
  );

  return response.data;
};