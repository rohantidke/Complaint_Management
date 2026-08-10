import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import * as adminApi from "../../api/adminApi";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";
import PriorityBadge from "../../components/PriorityBadge";
import SLACountdown from "../../components/SLACountdown";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [overdue, setOverdue] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  // ==========================================
  // LOAD ADMIN DASHBOARD
  // ==========================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        complaintResponse,
        overdueResponse,
      ] = await Promise.all([
        adminApi.getAdminComplaints({
          page: 0,
          size: 100,
          sort: "createdAt,desc",
        }),

        adminApi.getOverdueComplaints(),
      ]);

      // ========================================
      // COMPLAINT DATA
      // ========================================

      const complaintList =
        complaintResponse?.content ||
        (Array.isArray(complaintResponse)
          ? complaintResponse
          : []);

      setComplaints(complaintList);

      // ========================================
      // OVERDUE DATA
      // ========================================

      const overdueList =
        Array.isArray(overdueResponse)
          ? overdueResponse
          : overdueResponse?.content || [];

      setOverdue(overdueList);

    } catch (err) {
      console.error(
        "Admin Dashboard Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return <Loading />;
  }

  // ==========================================
  // STATISTICS
  // ==========================================

  const total = complaints.length;

  const submitted = complaints.filter(
    (complaint) =>
      complaint.status === "SUBMITTED"
  ).length;

  const assigned = complaints.filter(
    (complaint) =>
      complaint.status === "ASSIGNED"
  ).length;

  const inProgress = complaints.filter(
    (complaint) =>
      complaint.status === "IN_PROGRESS"
  ).length;

  const resolved = complaints.filter(
    (complaint) =>
      complaint.status === "RESOLVED" ||
      complaint.status === "CLOSED"
  ).length;

  // ==========================================
  // RECENT COMPLAINTS
  // ==========================================

  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 6);

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="admin-dashboard">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="admin-dashboard-header">

        <div>
          <span className="admin-eyebrow">
            ADMIN CONTROL CENTER
          </span>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Monitor complaints, staff activity,
            departments and SLA performance.
          </p>
        </div>

        <div className="admin-header-actions">

          <Link
            to="/admin/complaints"
            className="admin-primary-btn"
          >
            View Complaints →
          </Link>

        </div>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="admin-dashboard-error">
          <ErrorMessage error={error} />
        </div>
      )}


      {/* ======================================
          STAT CARDS
      ====================================== */}

      <div className="admin-stats-grid">

        {/* TOTAL */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon blue">
            📋
          </div>

          <div>
            <span>
              Total Complaints
            </span>

            <strong>
              {total}
            </strong>

            <small>
              All complaints
            </small>
          </div>

        </div>


        {/* SUBMITTED */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon yellow">
            🕐
          </div>

          <div>
            <span>
              Submitted
            </span>

            <strong>
              {submitted}
            </strong>

            <small>
              Waiting for assignment
            </small>
          </div>

        </div>


        {/* IN PROGRESS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon purple">
            ⚙️
          </div>

          <div>
            <span>
              In Progress
            </span>

            <strong>
              {assigned + inProgress}
            </strong>

            <small>
              Currently being handled
            </small>
          </div>

        </div>


        {/* RESOLVED */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon green">
            ✓
          </div>

          <div>
            <span>
              Resolved
            </span>

            <strong>
              {resolved}
            </strong>

            <small>
              Successfully completed
            </small>
          </div>

        </div>


        {/* OVERDUE */}

        <Link
          to="/admin/overdue"
          className="admin-stat-card admin-overdue-stat"
        >

          <div className="admin-stat-icon red">
            ⚠️
          </div>

          <div>
            <span>
              Overdue
            </span>

            <strong>
              {overdue.length}
            </strong>

            <small>
              SLA deadline passed
            </small>
          </div>

        </Link>

      </div>


      {/* ======================================
          MAIN GRID
      ====================================== */}

      <div className="admin-main-grid">

        {/* ====================================
            COMPLAINT OVERVIEW
        ==================================== */}

        <section className="admin-panel">

          <div className="admin-panel-header">

            <div>

              <span className="panel-eyebrow">
                SYSTEM OVERVIEW
              </span>

              <h2>
                Complaint Overview
              </h2>

              <p>
                Current complaint distribution
              </p>

            </div>

          </div>


          <div className="status-overview">

            {/* SUBMITTED */}

            <div className="status-overview-row">

              <div>
                <span className="status-dot submitted" />
                Submitted
              </div>

              <strong>
                {submitted}
              </strong>

            </div>


            {/* ASSIGNED */}

            <div className="status-overview-row">

              <div>
                <span className="status-dot assigned" />
                Assigned
              </div>

              <strong>
                {assigned}
              </strong>

            </div>


            {/* IN PROGRESS */}

            <div className="status-overview-row">

              <div>
                <span className="status-dot progress" />
                In Progress
              </div>

              <strong>
                {inProgress}
              </strong>

            </div>


            {/* RESOLVED */}

            <div className="status-overview-row">

              <div>
                <span className="status-dot resolved" />
                Resolved
              </div>

              <strong>
                {resolved}
              </strong>

            </div>


            {/* OVERDUE */}

            <div className="status-overview-row">

              <div>
                <span className="status-dot overdue" />
                Overdue
              </div>

              <strong>
                {overdue.length}
              </strong>

            </div>

          </div>

        </section>


        {/* ====================================
            QUICK ACTIONS
        ==================================== */}

        <section className="admin-panel">

          <div className="admin-panel-header">

            <div>

              <span className="panel-eyebrow">
                MANAGEMENT
              </span>

              <h2>
                Quick Actions
              </h2>

              <p>
                Frequently used admin tools
              </p>

            </div>

          </div>


          <div className="admin-quick-actions">

            {/* COMPLAINTS */}

            <Link
              to="/admin/complaints"
              className="admin-quick-action"
            >

              <div className="quick-icon blue">
                📋
              </div>

              <div>
                <strong>
                  Manage Complaints
                </strong>

                <span>
                  View and assign complaints
                </span>
              </div>

              <b>
                →
              </b>

            </Link>


            {/* STAFF */}

            <Link
              to="/admin/staff"
              className="admin-quick-action"
            >

              <div className="quick-icon purple">
                👥
              </div>

              <div>
                <strong>
                  Staff Management
                </strong>

                <span>
                  Manage staff members
                </span>
              </div>

              <b>
                →
              </b>

            </Link>


            {/* DEPARTMENTS */}

            <Link
              to="/admin/departments"
              className="admin-quick-action"
            >

              <div className="quick-icon green">
                🏢
              </div>

              <div>
                <strong>
                  Departments
                </strong>

                <span>
                  Manage departments
                </span>
              </div>

              <b>
                →
              </b>

            </Link>


            {/* OVERDUE */}

            <Link
              to="/admin/overdue"
              className="admin-quick-action"
            >

              <div className="quick-icon red">
                ⚠️
              </div>

              <div>
                <strong>
                  Overdue Complaints
                </strong>

                <span>
                  Check SLA violations
                </span>
              </div>

              <b>
                →
              </b>

            </Link>

          </div>

        </section>

      </div>


      {/* ======================================
          RECENT COMPLAINTS
      ====================================== */}

      <section className="admin-panel recent-panel">

        <div className="admin-panel-header">

          <div>

            <span className="panel-eyebrow">
              RECENT ACTIVITY
            </span>

            <h2>
              Recent Complaints
            </h2>

            <p>
              Latest complaints submitted
              to the system
            </p>

          </div>


          <Link
            to="/admin/complaints"
            className="admin-view-link"
          >
            View all →
          </Link>

        </div>


        {recentComplaints.length === 0 ? (

          <div className="admin-empty">

            <div>
              📭
            </div>

            <h3>
              No complaints found
            </h3>

            <p>
              There are no complaints to
              display.
            </p>

          </div>

        ) : (

          <div className="admin-complaint-list">

            {recentComplaints.map(
              (complaint) => (

                <Link
                  key={
                    complaint.id ||
                    complaint.complaintNumber
                  }
                  to={`/admin/complaints/${complaint.complaintNumber}`}
                  className="admin-complaint-row"
                >

                  {/* NUMBER */}

                  <div className="admin-complaint-number">

                    <span>
                      COMPLAINT
                    </span>

                    <strong>
                      #
                      {complaint.complaintNumber}
                    </strong>

                  </div>


                  {/* INFORMATION */}

                  <div className="admin-complaint-info">

                    <strong>
                      {complaint.title ||
                        "Untitled Complaint"}
                    </strong>

                    <span>
                      {complaint.category ||
                        "General Complaint"}
                    </span>

                  </div>


                  {/* BADGES + SLA */}

                  <div className="admin-complaint-badges">

                    {complaint.priority && (
                      <PriorityBadge
                        priority={
                          complaint.priority
                        }
                      />
                    )}

                    {complaint.status && (
                      <StatusBadge
                        status={
                          complaint.status
                        }
                      />
                    )}

                    {/* SLA COUNTDOWN */}

                    <SLACountdown
                      deadline={
                        complaint.slaDeadline
                      }
                      status={
                        complaint.status
                      }
                    />

                  </div>


                  {/* ARROW */}

                  <span className="row-arrow">
                    →
                  </span>

                </Link>

              )
            )}

          </div>

        )}

      </section>


      {/* ======================================
          SLA MONITOR
      ====================================== */}

      <section
        className={
          overdue.length > 0
            ? "admin-overdue-card has-overdue"
            : "admin-overdue-card"
        }
      >

        <div className="overdue-icon">
          {overdue.length > 0
            ? "⚠️"
            : "✓"}
        </div>


        <div className="overdue-content">

          <span>
            SLA MONITOR
          </span>

          <h2>
            {overdue.length} Overdue Complaint
            {overdue.length !== 1
              ? "s"
              : ""}
          </h2>

          <p>
            {overdue.length > 0
              ? "These complaints have passed their SLA deadline and may require immediate attention."
              : "Excellent! There are currently no overdue complaints."}
          </p>

        </div>


        <Link
          to="/admin/overdue"
          className="overdue-btn"
        >
          Review Overdue →
        </Link>

      </section>


      {/* ======================================
          REFRESH
      ====================================== */}

      <div className="admin-dashboard-footer">

        <button
          type="button"
          onClick={loadDashboard}
          className="admin-refresh-btn"
        >
          ↻ Refresh Dashboard
        </button>

      </div>

    </div>
  );
};

export default AdminDashboard;