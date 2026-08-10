import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import * as adminApi from "../../api/adminApi";
import * as departmentApi from "../../api/departmentApi";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";
import PriorityBadge from "../../components/PriorityBadge";

const AdminComplaints = () => {
  const [data, setData] = useState(null);

  const [departments, setDepartments] =
    useState([]);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    departmentId: "",
  });

  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [page, filters]);

  const loadDepartments = async () => {
    try {
      const result =
        await departmentApi.getDepartments();

      setDepartments(result);
    } catch (err) {
      setError(err);
    }
  };

  const loadComplaints = async () => {
    setLoading(true);

    try {
      const result =
        await adminApi.getAdminComplaints({
          page,
          size: 10,
          status: filters.status || undefined,
          priority:
            filters.priority || undefined,
          departmentId:
            filters.departmentId || undefined,
        });

      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setPage(0);

    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  if (loading && !data) {
    return <Loading />;
  }

  return (
    <div>
      <h1>All Complaints</h1>

      <ErrorMessage error={error} />

      <div className="filter-bar">

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">
            All Status
          </option>

          <option value="SUBMITTED">
            Submitted
          </option>

          <option value="ASSIGNED">
            Assigned
          </option>

          <option value="IN_PROGRESS">
            In Progress
          </option>

          <option value="RESOLVED">
            Resolved
          </option>

          <option value="CLOSED">
            Closed
          </option>
        </select>

        <select
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
        >
          <option value="">
            All Priority
          </option>

          <option value="LOW">
            Low
          </option>

          <option value="MEDIUM">
            Medium
          </option>

          <option value="HIGH">
            High
          </option>
        </select>

        <select
          name="departmentId"
          value={filters.departmentId}
          onChange={handleFilterChange}
        >
          <option value="">
            All Departments
          </option>

          {departments.map(
            (department) => (
              <option
                key={department.id}
                value={department.id}
              >
                {department.name}
              </option>
            )
          )}
        </select>

      </div>

      {data && (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Title</th>
                  <th>User</th>
                  <th>Department</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Staff</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {data.content?.map(
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
                        {complaint.userName ||
                          "-"}
                      </td>

                      <td>
                        {
                          complaint.departmentName
                        }
                      </td>

                      <td>
                        <PriorityBadge
                          priority={
                            complaint.priority
                          }
                        />
                      </td>

                      <td>
                        <StatusBadge
                          status={
                            complaint.status
                          }
                        />
                      </td>

                      <td>
                        {
                          complaint.assignedStaffName ||
                          "-"
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

          <div className="pagination">

            <button
              disabled={
                data.first
              }
              onClick={() =>
                setPage((p) => p - 1)
              }
            >
              Previous
            </button>

            <span>
              Page {data.number + 1} of{" "}
              {data.totalPages}
            </span>

            <button
              disabled={
                data.last
              }
              onClick={() =>
                setPage((p) => p + 1)
              }
            >
              Next
            </button>

          </div>
        </>
      )}
    </div>
  );
};

export default AdminComplaints;