import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import * as complaintApi from "../../api/complaintApi";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";
import PriorityBadge from "../../components/PriorityBadge";

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await complaintApi.getMyComplaints();

      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load complaints:", err);

      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const searchValue = search.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      complaint.complaintNumber
        ?.toLowerCase()
        .includes(searchValue) ||
      complaint.title
        ?.toLowerCase()
        .includes(searchValue) ||
      complaint.category
        ?.toLowerCase()
        .includes(searchValue);

    const matchesStatus =
      statusFilter === "ALL" ||
      complaint.status === statusFilter;

    const matchesPriority =
      priorityFilter === "ALL" ||
      complaint.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
  };

  if (loading) {
    return (
      <div className="my-complaints-page">
        <Loading />
      </div>
    );
  }

  return (
    <div className="my-complaints-page">

      {/* PAGE HEADER */}

      <div className="complaints-page-header">

        <div>
          <span className="page-eyebrow">
            USER PORTAL
          </span>

          <h1>My Complaints</h1>

          <p>
            View and track all complaints submitted
            through your account.
          </p>
        </div>

        <Link
          to="/user/complaints/create"
          className="new-complaint-btn"
        >
          <span>+</span>
          Raise Complaint
        </Link>

      </div>


      {/* ERROR */}

      {error && (
        <div className="complaints-error">
          <ErrorMessage error={error} />

          <button
            type="button"
            className="retry-btn"
            onClick={loadComplaints}
          >
            Try Again
          </button>
        </div>
      )}


      {/* SUMMARY */}

      <div className="complaints-summary">

        <div className="complaint-summary-card">

          <div className="summary-icon">
            📋
          </div>

          <div>
            <span>Total Complaints</span>
            <strong>{complaints.length}</strong>
          </div>

        </div>

        <div className="complaint-summary-card">

          <div className="summary-icon">
            ⏳
          </div>

          <div>
            <span>Active</span>

            <strong>
              {
                complaints.filter(
                  (item) =>
                    item.status !== "RESOLVED" &&
                    item.status !== "CLOSED"
                ).length
              }
            </strong>
          </div>

        </div>

        <div className="complaint-summary-card">

          <div className="summary-icon">
            ✓
          </div>

          <div>
            <span>Resolved</span>

            <strong>
              {
                complaints.filter(
                  (item) =>
                    item.status === "RESOLVED" ||
                    item.status === "CLOSED"
                ).length
              }
            </strong>
          </div>

        </div>

      </div>


      {/* FILTERS */}

      <div className="complaints-filter-card">

        <div className="complaint-search-box">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search complaint number, title or category..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="ALL">
            All Statuses
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
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value)
          }
        >
          <option value="ALL">
            All Priorities
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

          <option value="CRITICAL">
            Critical
          </option>
        </select>


        {(search ||
          statusFilter !== "ALL" ||
          priorityFilter !== "ALL") && (
          <button
            type="button"
            className="clear-filter-btn"
            onClick={clearFilters}
          >
            Clear
          </button>
        )}

      </div>


      {/* CONTENT */}

      {complaints.length === 0 ? (

        <div className="complaints-empty">

          <div className="empty-icon">
            📋
          </div>

          <h2>No complaints yet</h2>

          <p>
            You haven't submitted any complaints.
            Create your first complaint to get started.
          </p>

          <Link
            to="/user/complaints/create"
            className="empty-create-btn"
          >
            Raise Your First Complaint
          </Link>

        </div>

      ) : filteredComplaints.length === 0 ? (

        <div className="complaints-empty">

          <div className="empty-icon">
            🔍
          </div>

          <h2>No matching complaints</h2>

          <p>
            Try changing your search or filter options.
          </p>

          <button
            type="button"
            className="empty-clear-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>

      ) : (

        <div className="complaints-table-card">

          <div className="table-header">

            <div>
              <h2>Complaint Records</h2>

              <span>
                Showing {filteredComplaints.length} of{" "}
                {complaints.length} complaints
              </span>
            </div>

            <button
              type="button"
              className="refresh-btn"
              onClick={loadComplaints}
              title="Refresh complaints"
            >
              ↻ Refresh
            </button>

          </div>


          <div className="complaints-table-wrapper">

            <table className="complaints-table">

              <thead>
                <tr>
                  <th>Complaint</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Department</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredComplaints.map((complaint) => (

                  <tr key={complaint.id}>

                    <td>
                      <div className="complaint-number">
                        {complaint.complaintNumber}
                      </div>
                    </td>

                    <td>
                      <div className="complaint-title">
                        {complaint.title || "-"}
                      </div>
                    </td>

                    <td>
                      <span className="category-text">
                        {complaint.category || "-"}
                      </span>
                    </td>

                    <td>
                      <PriorityBadge
                        priority={complaint.priority}
                      />
                    </td>

                    <td>
                      <StatusBadge
                        status={complaint.status}
                      />
                    </td>

                    <td>
                      <span className="department-text">
                        {complaint.department || "-"}
                      </span>
                    </td>

                    <td>

                      <Link
                        to={`/user/complaints/${complaint.complaintNumber}`}
                        className="view-complaint-btn"
                      >
                        View
                        <span>→</span>
                      </Link>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
};

export default MyComplaints;