import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getMyComplaints } from "../../api/complaintApi";

import { useAuth } from "../../context/AuthContext";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";
import PriorityBadge from "../../components/PriorityBadge";

const UserDashboard = () => {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getMyComplaints();

      /*
       * Backend may return either:
       * 1. Array
       * 2. Spring Page object
       */
      if (Array.isArray(data)) {
        setComplaints(data);
      } else if (Array.isArray(data?.content)) {
        setComplaints(data.content);
      } else {
        setComplaints([]);
      }
    } catch (err) {
      console.error("Failed to load complaints:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load your complaints."
      );

      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const total = complaints.length;

  const submitted = complaints.filter(
    (item) => item.status === "SUBMITTED"
  ).length;

  const inProgress = complaints.filter(
    (item) =>
      item.status === "IN_PROGRESS" ||
      item.status === "ASSIGNED"
  ).length;

  const resolved = complaints.filter(
    (item) =>
      item.status === "RESOLVED" ||
      item.status === "CLOSED"
  ).length;

  const recentComplaints = useMemo(() => {
    return [...complaints]
      .sort((a, b) => {
        return (
          new Date(b?.createdAt || 0) -
          new Date(a?.createdAt || 0)
        );
      })
      .slice(0, 5);
  }, [complaints]);

  const userName = user?.name || "User";

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loading />
      </div>
    );
  }

  return (
    <div className="user-dashboard">

      {/* HEADER */}
      <div className="dashboard-header">

        <div className="dashboard-welcome">

          <span className="dashboard-eyebrow">
            USER PORTAL
          </span>

          <h1>
            Welcome back, {userName} 👋
          </h1>

          <p>
            Monitor your complaints and track their
            progress from one place.
          </p>

        </div>

        <Link
          to="/user/complaints/create"
          className="dashboard-primary-btn"
        >
          <span>＋</span>
          Raise Complaint
        </Link>

      </div>

      {/* ERROR */}
      {error && (
        <div className="dashboard-error">

          <ErrorMessage error={error} />

          <button
            type="button"
            className="dashboard-retry-btn"
            onClick={loadComplaints}
          >
            Try Again
          </button>

        </div>
      )}

      {/* STATISTICS */}
      <div className="dashboard-stats">

        <div className="dashboard-stat-card">

          <div className="stat-icon stat-blue">
            📋
          </div>

          <div className="stat-content">
            <span>Total Complaints</span>
            <strong>{total}</strong>
          </div>

        </div>

        <div className="dashboard-stat-card">

          <div className="stat-icon stat-yellow">
            🕐
          </div>

          <div className="stat-content">
            <span>Submitted</span>
            <strong>{submitted}</strong>
          </div>

        </div>

        <div className="dashboard-stat-card">

          <div className="stat-icon stat-purple">
            ⚙️
          </div>

          <div className="stat-content">
            <span>In Progress</span>
            <strong>{inProgress}</strong>
          </div>

        </div>

        <div className="dashboard-stat-card">

          <div className="stat-icon stat-green">
            ✓
          </div>

          <div className="stat-content">
            <span>Resolved</span>
            <strong>{resolved}</strong>
          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="dashboard-content-grid">

        {/* RECENT COMPLAINTS */}
        <section className="dashboard-panel">

          <div className="panel-title-row">

            <div>
              <h2>Recent Complaints</h2>

              <p>
                Your latest complaint activity
              </p>
            </div>

            <Link
              to="/user/complaints"
              className="panel-link"
            >
              View all →
            </Link>

          </div>

          {recentComplaints.length === 0 ? (

            <div className="empty-dashboard">

              <div className="empty-icon">
                📭
              </div>

              <h3>
                No complaints yet
              </h3>

              <p>
                You haven't submitted any complaints.
              </p>

              <Link
                to="/user/complaints/create"
                className="empty-action"
              >
                Raise your first complaint
              </Link>

            </div>

          ) : (

            <div className="complaint-list">

              {recentComplaints.map((complaint) => (

                <Link
                  key={
                    complaint.id ||
                    complaint.complaintNumber
                  }
                  to={`/user/complaints/${complaint.complaintNumber}`}
                  className="dashboard-complaint-row"
                >

                  <div className="complaint-row-main">

                    <strong>
                      {complaint.title ||
                        "Untitled Complaint"}
                    </strong>

                    <span>
                      #{complaint.complaintNumber}
                    </span>

                  </div>

                  <div className="complaint-row-meta">

                    {complaint.priority && (
                      <PriorityBadge
                        priority={complaint.priority}
                      />
                    )}

                    {complaint.status && (
                      <StatusBadge
                        status={complaint.status}
                      />
                    )}

                  </div>

                </Link>

              ))}

            </div>

          )}

        </section>

        {/* QUICK ACTIONS */}
        <section className="dashboard-panel quick-panel">

          <div className="panel-title-row">

            <div>
              <h2>Quick Actions</h2>

              <p>
                Frequently used options
              </p>
            </div>

          </div>

          <div className="quick-actions">

            <Link
              to="/user/complaints/create"
              className="quick-action"
            >

              <div className="quick-action-icon blue">
                📝
              </div>

              <div>
                <strong>
                  Raise Complaint
                </strong>

                <span>
                  Submit a new complaint
                </span>
              </div>

              <b>→</b>

            </Link>

            <Link
              to="/user/complaints"
              className="quick-action"
            >

              <div className="quick-action-icon purple">
                📋
              </div>

              <div>
                <strong>
                  My Complaints
                </strong>

                <span>
                  View all submitted complaints
                </span>
              </div>

              <b>→</b>

            </Link>

            <Link
              to="/user/notifications"
              className="quick-action"
            >

              <div className="quick-action-icon yellow">
                🔔
              </div>

              <div>
                <strong>
                  Notifications
                </strong>

                <span>
                  Check recent updates
                </span>
              </div>

              <b>→</b>

            </Link>

            <Link
              to="/user/profile"
              className="quick-action"
            >

              <div className="quick-action-icon green">
                👤
              </div>

              <div>
                <strong>
                  My Profile
                </strong>

                <span>
                  View your account
                </span>
              </div>

              <b>→</b>

            </Link>

          </div>

        </section>

      </div>

    </div>
  );
};

export default UserDashboard;