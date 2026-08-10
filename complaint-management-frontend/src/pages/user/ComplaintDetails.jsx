import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import * as complaintApi from "../../api/complaintApi";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";
import PriorityBadge from "../../components/PriorityBadge";
import FeedbackForm from "../../components/FeedbackForm";
import SLACountdown from "../../components/SLACountdown";

const ComplaintDetails = () => {
  const { complaintNumber } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================
  // LOAD COMPLAINT
  // ==========================================

  useEffect(() => {
    loadComplaint();
  }, [complaintNumber]);

  const loadComplaint = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await complaintApi.getComplaint(
        complaintNumber
      );

      setComplaint(data);
    } catch (err) {
      console.error(
        "Failed to load complaint:",
        err
      );

      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    try {
      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return value;
      }

      return date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return value;
    }
  };

  // ==========================================
  // FORMAT STATUS
  // ==========================================

  const formatStatus = (status) => {
    if (!status) {
      return "-";
    }

    return String(status).replaceAll("_", " ");
  };

  // ==========================================
  // CHECK RESOLVED / CLOSED
  // ==========================================

  const isCompleted =
    complaint?.status === "RESOLVED" ||
    complaint?.status === "CLOSED";

  // ==========================================
  // ATTACHMENTS
  // ==========================================

  const attachments = Array.isArray(
    complaint?.attachments
  )
    ? complaint.attachments
    : [];

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="details-page">
        <Loading />
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="details-page">

        <div className="details-error-card">

          <div className="details-error-icon">
            ⚠️
          </div>

          <h2>
            Unable to Load Complaint
          </h2>

          <p>
            Something went wrong while loading
            this complaint.
          </p>

          <ErrorMessage error={error} />

          <div className="details-error-actions">

            <button
              type="button"
              className="details-retry-btn"
              onClick={loadComplaint}
            >
              Try Again
            </button>

            <Link
              to="/user/complaints"
              className="details-back-btn"
            >
              Back to My Complaints
            </Link>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!complaint) {
    return (
      <div className="details-page">

        <div className="details-error-card">

          <div className="details-error-icon">
            📭
          </div>

          <h2>
            Complaint Not Found
          </h2>

          <p>
            We could not find the requested
            complaint.
          </p>

          <Link
            to="/user/complaints"
            className="details-primary-btn"
          >
            Back to My Complaints
          </Link>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="details-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="details-page-header">

        <div>

          <Link
            to="/user/complaints"
            className="back-link"
          >
            ← Back to My Complaints
          </Link>

          <span className="page-eyebrow">
            COMPLAINT DETAILS
          </span>

          <h1>
            {complaint.title || "Complaint"}
          </h1>

          <div className="complaint-number-display">
            Complaint No:{" "}
            <strong>
              {complaint.complaintNumber}
            </strong>
          </div>

        </div>

        <div className="details-header-status">

          {complaint.status && (
            <StatusBadge
              status={complaint.status}
            />
          )}

        </div>

      </div>


      {/* ======================================
          STATUS CARD
      ====================================== */}

      <div className="complaint-status-card">

        <div className="status-card-left">

          <div className="status-card-icon">
            ✓
          </div>

          <div>

            <span>
              Current Status
            </span>

            <strong>
              {formatStatus(
                complaint.status
              )}
            </strong>

          </div>

        </div>

        <div className="status-card-right">

          <span>
            Last Updated
          </span>

          <strong>
            {formatDate(
              complaint.updatedAt
            )}
          </strong>

        </div>

      </div>


      {/* ======================================
          SLA COUNTDOWN
      ====================================== */}

      {complaint.slaDeadline && !isCompleted && (

        <div className="details-card sla-card">

          <div className="details-card-header">

            <div>

              <span className="card-eyebrow">
                SLA MONITOR
              </span>

              <h2>
                Resolution Deadline
              </h2>

              <p>
                Time remaining before this
                complaint becomes overdue.
              </p>

            </div>

          </div>

          <div className="sla-countdown-container">

            <SLACountdown
              deadline={complaint.slaDeadline}
            />

          </div>

          <div className="sla-deadline-text">

            <span>
              SLA Deadline
            </span>

            <strong>
              {formatDate(
                complaint.slaDeadline
              )}
            </strong>

          </div>

        </div>

      )}


      {/* ======================================
          MAIN GRID
      ====================================== */}

      <div className="details-grid">


        {/* ====================================
            DESCRIPTION
        ==================================== */}

        <div className="details-card details-description-card">

          <div className="details-card-header">

            <div>

              <span className="card-eyebrow">
                INFORMATION
              </span>

              <h2>
                Complaint Description
              </h2>

            </div>

          </div>

          <div className="description-content">

            {complaint.description ||
              "No description provided."}

          </div>

        </div>


        {/* ====================================
            COMPLAINT INFORMATION
        ==================================== */}

        <div className="details-card">

          <div className="details-card-header">

            <div>

              <span className="card-eyebrow">
                DETAILS
              </span>

              <h2>
                Complaint Information
              </h2>

            </div>

          </div>

          <div className="details-information-grid">

            {/* CATEGORY */}

            <div className="information-item">

              <span>
                Category
              </span>

              <strong>
                {complaint.category || "-"}
              </strong>

            </div>


            {/* PRIORITY */}

            <div className="information-item">

              <span>
                Priority
              </span>

              <strong>

                {complaint.priority ? (
                  <PriorityBadge
                    priority={
                      complaint.priority
                    }
                  />
                ) : (
                  "-"
                )}

              </strong>

            </div>


            {/* LOCATION */}

            <div className="information-item">

              <span>
                Location
              </span>

              <strong>
                {complaint.location || "-"}
              </strong>

            </div>


            {/* DEPARTMENT */}

            <div className="information-item">

              <span>
                Department
              </span>

              <strong>
                {complaint.departmentName ||
                  complaint.department ||
                  "-"}
              </strong>

            </div>


            {/* STAFF */}

            <div className="information-item">

              <span>
                Assigned Staff
              </span>

              <strong>
                {complaint.assignedStaffName ||
                  complaint.assignedStaff ||
                  "-"}
              </strong>

            </div>


            {/* NUMBER */}

            <div className="information-item">

              <span>
                Complaint Number
              </span>

              <strong>
                {complaint.complaintNumber}
              </strong>

            </div>

          </div>

        </div>


        {/* ====================================
            TIMELINE
        ==================================== */}

        <div className="details-card">

          <div className="details-card-header">

            <div>

              <span className="card-eyebrow">
                TIMELINE
              </span>

              <h2>
                Important Dates
              </h2>

            </div>

          </div>

          <div className="details-date-list">


            {/* CREATED */}

            <div className="date-item">

              <div className="date-dot">
                +
              </div>

              <div>

                <span>
                  Complaint Created
                </span>

                <strong>
                  {formatDate(
                    complaint.createdAt
                  )}
                </strong>

              </div>

            </div>


            {/* SLA */}

            <div className="date-item">

              <div className="date-dot">
                ⏱
              </div>

              <div>

                <span>
                  SLA Deadline
                </span>

                <strong>
                  {formatDate(
                    complaint.slaDeadline
                  )}
                </strong>

              </div>

            </div>


            {/* UPDATED */}

            <div className="date-item">

              <div className="date-dot">
                ↻
              </div>

              <div>

                <span>
                  Last Updated
                </span>

                <strong>
                  {formatDate(
                    complaint.updatedAt
                  )}
                </strong>

              </div>

            </div>


            {/* RESOLVED */}

            <div className="date-item">

              <div className="date-dot">
                ✓
              </div>

              <div>

                <span>
                  Resolved At
                </span>

                <strong>
                  {formatDate(
                    complaint.resolvedAt
                  )}
                </strong>

              </div>

            </div>


            {/* CLOSED */}

            <div className="date-item">

              <div className="date-dot">
                ✓
              </div>

              <div>

                <span>
                  Closed At
                </span>

                <strong>
                  {formatDate(
                    complaint.closedAt
                  )}
                </strong>

              </div>

            </div>

          </div>

        </div>


        {/* ====================================
            ATTACHMENTS
        ==================================== */}

        <div className="details-card">

          <div className="details-card-header">

            <div>

              <span className="card-eyebrow">
                FILES
              </span>

              <h2>
                Attachments
              </h2>

              <p>
                Files attached to this complaint.
              </p>

            </div>

          </div>


          {attachments.length === 0 ? (

            <div className="attachments-empty">

              <div className="attachments-empty-icon">
                📎
              </div>

              <strong>
                No attachments
              </strong>

              <span>
                No files have been attached
                to this complaint.
              </span>

            </div>

          ) : (

            <div className="attachments-list">

              {attachments.map(
                (attachment, index) => {

                  const fileName =
                    attachment.fileName ||
                    attachment.name ||
                    `Attachment ${
                      index + 1
                    }`;

                  const fileUrl =
                    attachment.fileUrl ||
                    attachment.url ||
                    attachment.downloadUrl;

                  return (
                    <div
                      className="attachment-item"
                      key={
                        attachment.id ||
                        index
                      }
                    >

                      <div className="attachment-icon">
                        📎
                      </div>

                      <div className="attachment-info">

                        <strong>
                          {fileName}
                        </strong>

                        {attachment.fileType && (
                          <span>
                            {
                              attachment.fileType
                            }
                          </span>
                        )}

                        {attachment.fileSize && (
                          <small>
                            {
                              attachment.fileSize
                            }
                          </small>
                        )}

                      </div>

                      {fileUrl && (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="attachment-view-btn"
                        >
                          View
                        </a>
                      )}

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>


        {/* ====================================
            COMPLAINT HISTORY
        ==================================== */}

        <div className="details-card details-actions-card">

          <div>

            <span className="card-eyebrow">
              TRACKING
            </span>

            <h2>
              Complaint History
            </h2>

            <p>
              View the complete history of
              status changes and actions taken
              on your complaint.
            </p>

          </div>

          <Link
            to={`/user/complaints/${complaint.complaintNumber}/history`}
            className="history-btn"
          >
            View Complaint History

            <span>
              →
            </span>

          </Link>

        </div>


        {/* ====================================
            FEEDBACK
        ==================================== */}

        {isCompleted && (

          <div className="details-card feedback-card">

            <div className="details-card-header">

              <div>

                <span className="card-eyebrow">
                  YOUR FEEDBACK
                </span>

                <h2>
                  Rate Your Experience
                </h2>

                <p>
                  Your feedback helps us improve
                  our complaint resolution service.
                </p>

              </div>

            </div>

            <FeedbackForm
              complaintNumber={
                complaint.complaintNumber
              }
            />

          </div>

        )}

      </div>


      {/* ======================================
          BOTTOM ACTIONS
      ====================================== */}

      <div className="details-bottom-actions">

        <Link
          to="/user/complaints"
          className="details-back-btn"
        >
          ← Back to My Complaints
        </Link>

        <Link
          to={`/user/complaints/${complaint.complaintNumber}/history`}
          className="details-primary-btn"
        >
          View History →
        </Link>

      </div>

    </div>
  );
};

export default ComplaintDetails;