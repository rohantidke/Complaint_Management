import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import * as staffApi from "../../api/staffApi";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";
import PriorityBadge from "../../components/PriorityBadge";

const StaffDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await staffApi.getAssignedComplaints();

      /*
       * Supports both:
       * [
       *   {...}
       * ]
       *
       * and Spring Page response:
       * {
       *   content: [...]
       * }
       */
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : [];

      setComplaints(list);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load assigned complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = complaints.length;

    const assigned = complaints.filter(
      (item) =>
        String(item.status || "").toUpperCase() === "ASSIGNED"
    ).length;

    const inProgress = complaints.filter(
      (item) =>
        String(item.status || "").toUpperCase() ===
        "IN_PROGRESS"
    ).length;

    const resolved = complaints.filter((item) => {
      const status = String(item.status || "").toUpperCase();

      return status === "RESOLVED" || status === "CLOSED";
    }).length;

    const highPriority = complaints.filter((item) => {
      const priority = String(
        item.priority || ""
      ).toUpperCase();

      return (
        priority === "HIGH" ||
        priority === "CRITICAL"
      );
    }).length;

    return {
      total,
      assigned,
      inProgress,
      resolved,
      highPriority,
    };
  }, [complaints]);

  const recentComplaints = useMemo(() => {
    return [...complaints]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      )
      .slice(0, 6);
  }, [complaints]);

  if (loading) {
    return (
      <div className="staff-dashboard-loading">
        <Loading />
      </div>
    );
  }

  return (
    <div className="staff-dashboard">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="staff-dashboard-header">

        <div className="staff-welcome">

          <span className="staff-eyebrow">
            STAFF WORKSPACE
          </span>

          <h1>Staff Dashboard</h1>

          <p>
            Manage your assigned complaints,
            track progress and resolve issues
            efficiently.
          </p>

        </div>

        <div className="staff-header-actions">

          <Link
            to="/staff/complaints"
            className="staff-primary-button"
          >
            <span>📋</span>
            View Assigned Complaints
          </Link>

          <Link
            to="/staff/notifications"
            className="staff-secondary-button"
          >
            🔔 Notifications
          </Link>

        </div>

      </div>


      {/* =====================================
          ERROR
      ====================================== */}

      {error && (
        <div className="staff-dashboard-error">
          <ErrorMessage error={error} />

          <button
            type="button"
            className="staff-retry-button"
            onClick={loadDashboard}
          >
            Try Again
          </button>
        </div>
      )}


      {/* =====================================
          STATS
      ====================================== */}

      <div className="staff-stats-grid">

        <div className="staff-stat-card">

          <div className="staff-stat-icon blue">
            📋
          </div>

          <div className="staff-stat-content">

            <span>Total Assigned</span>

            <strong>{stats.total}</strong>

            <small>
              Complaints assigned to you
            </small>

          </div>

        </div>


        <div className="staff-stat-card">

          <div className="staff-stat-icon orange">
            🕐
          </div>

          <div className="staff-stat-content">

            <span>Assigned</span>

            <strong>{stats.assigned}</strong>

            <small>
              Waiting for action
            </small>

          </div>

        </div>


        <div className="staff-stat-card">

          <div className="staff-stat-icon purple">
            ⚙️
          </div>

          <div className="staff-stat-content">

            <span>In Progress</span>

            <strong>{stats.inProgress}</strong>

            <small>
              Currently being handled
            </small>

          </div>

        </div>


        <div className="staff-stat-card">

          <div className="staff-stat-icon green">
            ✓
          </div>

          <div className="staff-stat-content">

            <span>Resolved</span>

            <strong>{stats.resolved}</strong>

            <small>
              Successfully completed
            </small>

          </div>

        </div>

      </div>


      {/* =====================================
          PRIORITY ALERT
      ====================================== */}

      {stats.highPriority > 0 && (
        <div className="staff-priority-alert">

          <div className="staff-alert-icon">
            !
          </div>

          <div className="staff-alert-content">

            <strong>
              High priority attention required
            </strong>

            <p>
              You currently have{" "}
              <b>{stats.highPriority}</b>{" "}
              high or critical priority complaint
              {stats.highPriority !== 1 ? "s" : ""}.
            </p>

          </div>

          <Link
            to="/staff/complaints"
            className="staff-alert-action"
          >
            Review Now →
          </Link>

        </div>
      )}


      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <div className="staff-dashboard-grid">


        {/* RECENT COMPLAINTS */}

        <section className="staff-panel">

          <div className="staff-panel-header">

            <div>

              <span className="staff-panel-label">
                WORK QUEUE
              </span>

              <h2>Recent Complaints</h2>

              <p>
                Your latest assigned complaints
              </p>

            </div>

            <Link
              to="/staff/complaints"
              className="staff-view-link"
            >
              View All →
            </Link>

          </div>


          {recentComplaints.length === 0 ? (

            <div className="staff-empty-state">

              <div className="staff-empty-icon">
                ✓
              </div>

              <h3>All caught up!</h3>

              <p>
                You currently have no assigned
                complaints.
              </p>

            </div>

          ) : (

            <div className="staff-complaint-list">

              {recentComplaints.map((complaint) => (

                <Link
                  key={
                    complaint.id ||
                    complaint.complaintNumber
                  }
                  to={`/staff/complaints/${complaint.complaintNumber}`}
                  className="staff-complaint-item"
                >

                  <div className="staff-complaint-number">

                    <span>
                      #{complaint.complaintNumber}
                    </span>

                    <strong>
                      {complaint.title ||
                        "Untitled Complaint"}
                    </strong>

                    <small>
                      {complaint.createdAt
                        ? new Date(
                            complaint.createdAt
                          ).toLocaleDateString()
                        : "Date unavailable"}
                    </small>

                  </div>


                  <div className="staff-complaint-meta">

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

                    <span className="staff-row-arrow">
                      →
                    </span>

                  </div>

                </Link>

              ))}

            </div>

          )}

        </section>


        {/* QUICK ACTIONS */}

        <section className="staff-panel staff-quick-panel">

          <div className="staff-panel-header">

            <div>

              <span className="staff-panel-label">
                SHORTCUTS
              </span>

              <h2>Quick Actions</h2>

              <p>
                Frequently used staff tools
              </p>

            </div>

          </div>


          <div className="staff-quick-actions">

            <Link
              to="/staff/complaints"
              className="staff-quick-action"
            >

              <div className="staff-action-icon blue">
                📋
              </div>

              <div>

                <strong>
                  Assigned Complaints
                </strong>

                <span>
                  View and manage your work queue
                </span>

              </div>

              <b>→</b>

            </Link>


            <Link
              to="/staff/notifications"
              className="staff-quick-action"
            >

              <div className="staff-action-icon orange">
                🔔
              </div>

              <div>

                <strong>
                  Notifications
                </strong>

                <span>
                  Check complaint updates
                </span>

              </div>

              <b>→</b>

            </Link>


            <Link
              to="/staff/profile"
              className="staff-quick-action"
            >

              <div className="staff-action-icon purple">
                👤
              </div>

              <div>

                <strong>
                  My Profile
                </strong>

                <span>
                  View your staff account
                </span>

              </div>

              <b>→</b>

            </Link>

          </div>

        </section>

      </div>


      {/* =====================================
          PERFORMANCE
      ====================================== */}

      <section className="staff-performance">

        <div className="staff-performance-header">

          <div>

            <span className="staff-panel-label">
              WORK OVERVIEW
            </span>

            <h2>Your Complaint Progress</h2>

          </div>

          <span className="staff-performance-total">
            {stats.total} Total
          </span>

        </div>


        <div className="staff-progress-container">

          <div className="staff-progress-row">

            <div className="staff-progress-info">

              <span>
                Assigned
              </span>

              <strong>
                {stats.assigned}
              </strong>

            </div>

            <div className="staff-progress-track">

              <div
                className="staff-progress-fill assigned"
                style={{
                  width: `${
                    stats.total
                      ? (stats.assigned /
                          stats.total) *
                        100
                      : 0
                  }%`,
                }}
              />

            </div>

          </div>


          <div className="staff-progress-row">

            <div className="staff-progress-info">

              <span>
                In Progress
              </span>

              <strong>
                {stats.inProgress}
              </strong>

            </div>

            <div className="staff-progress-track">

              <div
                className="staff-progress-fill progress"
                style={{
                  width: `${
                    stats.total
                      ? (stats.inProgress /
                          stats.total) *
                        100
                      : 0
                  }%`,
                }}
              />

            </div>

          </div>


          <div className="staff-progress-row">

            <div className="staff-progress-info">

              <span>
                Resolved
              </span>

              <strong>
                {stats.resolved}
              </strong>

            </div>

            <div className="staff-progress-track">

              <div
                className="staff-progress-fill resolved"
                style={{
                  width: `${
                    stats.total
                      ? (stats.resolved /
                          stats.total) *
                        100
                      : 0
                  }%`,
                }}
              />

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default StaffDashboard;