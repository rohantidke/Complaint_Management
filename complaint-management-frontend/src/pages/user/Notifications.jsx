import { useEffect, useState } from "react";

import * as notificationApi from "../../api/notificationApi";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [readingId, setReadingId] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const [notificationsData, countData] =
        await Promise.all([
          notificationApi.getMyNotifications(),
          notificationApi.getUnreadCount(),
        ]);

      setNotifications(
        Array.isArray(notificationsData)
          ? notificationsData
          : []
      );

      setUnreadCount(
        Number.isFinite(Number(countData))
          ? Number(countData)
          : 0
      );
    } catch (err) {
      console.error(
        "Failed to load notifications:",
        err
      );

      setError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const isNotificationRead = (notification) => {
    return Boolean(
      notification.read ??
        notification.isRead ??
        false
    );
  };

  const handleRead = async (id) => {
    try {
      setReadingId(id);
      setError(null);

      await notificationApi.markAsRead(id);

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                read: true,
                isRead: true,
              }
            : notification
        )
      );

      setUnreadCount((current) =>
        Math.max(0, current - 1)
      );
    } catch (err) {
      console.error(
        "Failed to mark notification as read:",
        err
      );

      setError(err);
    } finally {
      setReadingId(null);
    }
  };

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    try {
      return new Date(value).toLocaleString(
        undefined,
        {
          dateStyle: "medium",
          timeStyle: "short",
        }
      );
    } catch {
      return value;
    }
  };

  if (loading) {
    return (
      <div className="notifications-page">
        <Loading />
      </div>
    );
  }

  return (
    <div className="notifications-page">

      {/* HEADER */}

      <div className="notifications-header">

        <div>
          <span className="notifications-eyebrow">
            ACCOUNT
          </span>

          <h1>
            Notifications
          </h1>

          <p>
            Stay updated about your complaints
            and account activity.
          </p>
        </div>

        <button
          type="button"
          className="notification-refresh-btn"
          onClick={() => loadNotifications(true)}
          disabled={refreshing}
        >
          {refreshing
            ? "Refreshing..."
            : "↻ Refresh"}
        </button>

      </div>


      {/* ERROR */}

      <ErrorMessage error={error} />


      {/* SUMMARY */}

      <div className="notification-summary">

        <div className="notification-summary-icon">
          🔔
        </div>

        <div>
          <span>
            Unread Notifications
          </span>

          <strong>
            {unreadCount}
          </strong>
        </div>

      </div>


      {/* EMPTY STATE */}

      {notifications.length === 0 ? (
        <div className="notifications-empty">

          <div className="notifications-empty-icon">
            ✓
          </div>

          <h2>
            You're all caught up
          </h2>

          <p>
            You don't have any notifications
            right now.
          </p>

          <button
            type="button"
            className="notification-empty-btn"
            onClick={() =>
              loadNotifications(true)
            }
          >
            Check Again
          </button>

        </div>
      ) : (

        /* NOTIFICATIONS */

        <div className="notifications-list">

          {notifications.map(
            (notification) => {
              const read =
                isNotificationRead(
                  notification
                );

              return (
                <div
                  key={notification.id}
                  className={`notification-card ${
                    !read ? "unread" : ""
                  }`}
                >

                  <div
                    className={`notification-icon ${
                      !read
                        ? "notification-icon-unread"
                        : ""
                    }`}
                  >
                    {read ? "✓" : "!"}
                  </div>


                  <div className="notification-content">

                    <div className="notification-top">

                      <div>
                        <span className="notification-label">
                          {read
                            ? "Notification"
                            : "New Notification"}
                        </span>

                        <p>
                          {notification.message ||
                            "You have a new notification."}
                        </p>
                      </div>

                      {!read && (
                        <span className="unread-dot"></span>
                      )}

                    </div>


                    <div className="notification-bottom">

                      <span className="notification-date">
                        {formatDate(
                          notification.createdAt
                        )}
                      </span>

                      {!read && (
                        <button
                          type="button"
                          className="mark-read-btn"
                          disabled={
                            readingId ===
                            notification.id
                          }
                          onClick={() =>
                            handleRead(
                              notification.id
                            )
                          }
                        >
                          {readingId ===
                          notification.id
                            ? "Updating..."
                            : "Mark as read"}
                        </button>
                      )}

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
};

export default Notifications;