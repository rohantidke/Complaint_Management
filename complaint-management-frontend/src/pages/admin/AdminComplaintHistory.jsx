import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import * as adminApi from "../../api/adminApi";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";

const AdminComplaintHistory = () => {
  const { complaintNumber } = useParams();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, [complaintNumber]);

  const load = async () => {
    try {
      const data =
        await adminApi.getAdminComplaintHistory(
          complaintNumber
        );

      setHistory(data);
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
      <h1>Complaint History</h1>

      <p>
        Complaint: {complaintNumber}
      </p>

      <ErrorMessage error={error} />

      {history.map((item, index) => (
        <div
          className="history-item"
          key={index}
        >
          <StatusBadge
            status={item.newStatus}
          />

          <p>
            {item.oldStatus || "Created"}
            {" → "}
            {item.newStatus}
          </p>

          <p>{item.comment}</p>

          <small>
            Changed by:{" "}
            {item.changedBy || "System"}
          </small>

          <br />

          <small>{item.createdAt}</small>
        </div>
      ))}
    </div>
  );
};

export default AdminComplaintHistory;