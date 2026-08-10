import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import * as complaintApi from "../../api/complaintApi";
import * as staffApi from "../../api/staffApi";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";
import PriorityBadge from "../../components/PriorityBadge";

const StaffComplaintDetails = () => {
  const { complaintNumber } = useParams();

  const [complaint, setComplaint] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    loadComplaint();
  }, [complaintNumber]);

  const loadComplaint = async () => {
    try {
      const data =
        await complaintApi.getComplaint(
          complaintNumber
        );

      setComplaint(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const startComplaint = async () => {
    setActionLoading(true);
    setError(null);

    try {
      const data =
        await staffApi.startComplaint(
          complaintNumber
        );

      setComplaint(data);
    } catch (err) {
      setError(err);
    } finally {
      setActionLoading(false);
    }
  };

  const resolveComplaint = async () => {
    setActionLoading(true);
    setError(null);

    try {
      const data =
        await staffApi.resolveComplaint(
          complaintNumber
        );

      setComplaint(data);
    } catch (err) {
      setError(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>Complaint Details</h1>

      <ErrorMessage error={error} />

      {complaint && (
        <div className="details-card">

          <h2>{complaint.title}</h2>

          <p>
            <strong>Complaint:</strong>{" "}
            {complaint.complaintNumber}
          </p>

          <p>
            <strong>Description:</strong>{" "}
            {complaint.description}
          </p>

          <p>
            <strong>Category:</strong>{" "}
            {complaint.category}
          </p>

          <p>
            <strong>Priority:</strong>{" "}
            <PriorityBadge
              priority={complaint.priority}
            />
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <StatusBadge
              status={complaint.status}
            />
          </p>

          <p>
            <strong>Department:</strong>{" "}
            {complaint.department || "-"}
          </p>

          <p>
            <strong>Assigned Staff:</strong>{" "}
            {complaint.assignedStaff || "-"}
          </p>

          {complaint.status ===
            "ASSIGNED" && (
            <button
              onClick={startComplaint}
              disabled={actionLoading}
            >
              {actionLoading
                ? "Starting..."
                : "Start Complaint"}
            </button>
          )}

          {complaint.status ===
            "IN_PROGRESS" && (
            <button
              onClick={resolveComplaint}
              disabled={actionLoading}
            >
              {actionLoading
                ? "Resolving..."
                : "Resolve Complaint"}
            </button>
          )}

        </div>
      )}
    </div>
  );
};

export default StaffComplaintDetails;