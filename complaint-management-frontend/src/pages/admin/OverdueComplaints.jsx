import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import * as adminApi from "../../api/adminApi";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

const OverdueComplaints = () => {
  const [complaints, setComplaints] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data =
        await adminApi.getOverdueComplaints();

      setComplaints(data);
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
      <h1>Overdue Complaints</h1>

      <ErrorMessage error={error} />

      {complaints.length === 0 ? (
        <p>No overdue complaints.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Complaint</th>
                <th>Title</th>
                <th>Status</th>
                <th>SLA Deadline</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map(
                (complaint) => (
                  <tr key={complaint.id}>
                    <td>
                      {
                        complaint.complaintNumber
                      }
                    </td>

                    <td>
                      {complaint.title}
                    </td>

                    <td>
                      {complaint.status}
                    </td>

                    <td>
                      {
                        complaint.slaDeadline
                      }
                    </td>

                    <td>
                      <Link
                        to={`/admin/complaints/${complaint.complaintNumber}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OverdueComplaints;