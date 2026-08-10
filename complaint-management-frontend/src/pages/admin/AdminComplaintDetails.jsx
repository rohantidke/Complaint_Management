import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import * as adminApi from "../../api/adminApi";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";
import PriorityBadge from "../../components/PriorityBadge";

const AdminComplaintDetails = () => {
  const { complaintNumber } = useParams();

  const [complaint, setComplaint] =
    useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplaint();
  }, [complaintNumber]);

  const loadComplaint = async () => {
    try {
      const data =
        await adminApi.getAdminComplaint(
          complaintNumber
        );

      setComplaint(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
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
            <strong>Complaint Number:</strong>{" "}
            {complaint.complaintNumber}
          </p>

          <p>
            <strong>Description:</strong>{" "}
            {complaint.description}
          </p>

          <p>
            <strong>User:</strong>{" "}
            {complaint.userName}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {complaint.userEmail}
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
            {complaint.departmentName ||
              "-"}
          </p>

          <p>
            <strong>Assigned Staff:</strong>{" "}
            {complaint.assignedStaffName ||
              "-"}
          </p>

          <p>
            <strong>SLA Deadline:</strong>{" "}
            {complaint.slaDeadline || "-"}
          </p>

          <p>
            <strong>Overdue:</strong>{" "}
            {complaint.overdue
              ? "Yes"
              : "No"}
          </p>

          <Link
            className="button"
            to={`/admin/complaints/${complaint.complaintNumber}/assign`}
          >
            Assign Complaint
          </Link>

          <Link
            className="button secondary"
            to={`/admin/complaints/${complaint.complaintNumber}/history`}
          >
            View History
          </Link>

        </div>
      )}
    </div>
  );
};

export default AdminComplaintDetails;