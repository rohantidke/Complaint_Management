import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import * as complaintApi from "../../api/complaintApi";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";

const ComplaintHistory = () => {
  const { complaintNumber } = useParams();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHistory();
  }, [complaintNumber]);

  const loadHistory = async () => {
    try {
      const data =
        await complaintApi.getComplaintHistory(
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
        Complaint:{" "}
        <strong>{complaintNumber}</strong>
      </p>

      <ErrorMessage error={error} />

      <div className="timeline">
        {history.map((item, index) => (
          <div
            className="history-item"
            key={index}
          >
            <div>
              <StatusBadge
                status={item.newStatus}
              />
            </div>

            <p>
              <strong>
                {item.oldStatus || "Created"}
              </strong>
              {" → "}
              <strong>
                {item.newStatus}
              </strong>
            </p>

            <p>
              {item.comment}
            </p>

            <small>
              Changed by:{" "}
              {item.changedBy || "System"}
            </small>

            <br />

            <small>
              {item.createdAt}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintHistory;