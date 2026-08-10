import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import * as staffApi from "../../api/staffApi";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import StatusBadge from "../../components/StatusBadge";
import PriorityBadge from "../../components/PriorityBadge";

const AssignedComplaints = () => {
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

      const data = await staffApi.getAssignedComplaints();

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

  const filteredComplaints = useMemo(() => {
    const query = search.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const status = String(
        complaint.status || ""
      ).toUpperCase();

      const priority = String(
        complaint.priority || ""
      ).toUpperCase();

      const matchesSearch =
        !query ||
        String(
          complaint.complaintNumber || ""
        )
          .toLowerCase()
          .includes(query) ||
        String(complaint.title || "")
          .toLowerCase()
          .includes(query) ||
        String(complaint.category || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" ||
        priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    complaints,
    search,
    statusFilter,
    priorityFilter,
  ]);

  const total = complaints.length;

  const assigned = complaints.filter(
    (item) =>
      String(item.status || "").toUpperCase() ===
      "ASSIGNED"
  ).length;

  const inProgress = complaints.filter(
    (item) =>
      String(item.status || "").toUpperCase() ===
      "IN_PROGRESS"
  ).length;

  const highPriority = complaints.filter((item) => {
    const priority = String(
      item.priority || ""
    ).toUpperCase();

    return (
      priority === "HIGH" ||
      priority === "CRITICAL"
    );
  }).length;

  if (loading) {
    return (
      <div className="staff-complaints-loading">
        <Loading />
      </div>
    );
  }

  return (
    <div className="assigned-complaints-page">

      {/* HEADER */}

      <div className="assigned-page-header">

        <div>
          <span className="assigned-eyebrow">
            STAFF WORK QUEUE
          </span>

          <h1>Assigned Complaints</h1>

          <p>
            Review, prioritize and manage the
            complaints assigned to you.
          </p>
        </div>

        <button
          type="button"
          className="assigned-refresh-button"
          onClick={loadComplaints}
        >
          ↻ Refresh
        </button>

      </div>


      {/* ERROR */}

      {error && (
        <div className="assigned-error">
          <ErrorMessage error={error} />

          <button
            type="button"
            onClick={loadComplaints}
          >
            Try Again
          </button>
        </div>
      )}


      {/* SUMMARY */}

      <div className="assigned-summary-grid">

        <div className="assigned-summary-card">
          <div className="assigned-summary-icon blue">
            📋
          </div>

          <div>
            <span>Total Assigned</span>
            <strong>{total}</strong>
          </div>
        </div>


        <div className="assigned-summary-card">
          <div className="assigned-summary-icon orange">
            🕐
          </div>

          <div>
            <span>Waiting</span>
            <strong>{assigned}</strong>
          </div>
        </div>


        <div className="assigned-summary-card">
          <div className="assigned-summary-icon purple">
            ⚙️
          </div>

          <div>
            <span>In Progress</span>
            <strong>{inProgress}</strong>
          </div>
        </div>


        <div className="assigned-summary-card">
          <div className="assigned-summary-icon red">
            !
          </div>

          <div>
            <span>High Priority</span>
            <strong>{highPriority}</strong>
          </div>
        </div>

      </div>


      {/* FILTER BAR */}

      <div className="assigned-filter-card">

        <div className="assigned-search">

          <span className="search-icon">
            🔎
          </span>

          <input
            type="text"
            placeholder="Search complaint number, title or category..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}

        </div>


        <div className="assigned-filter">

          <label>Status</label>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="ALL">
              All Statuses
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

        </div>


        <div className="assigned-filter">

          <label>Priority</label>

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
          >
            <option value="ALL">
              All Priorities
            </option>

            <option value="CRITICAL">
              Critical
            </option>

            <option value="HIGH">
              High
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="LOW">
              Low
            </option>
          </select>

        </div>

      </div>


      {/* RESULTS HEADER */}

      <div className="assigned-results-header">

        <div>
          <h2>Your Work Queue</h2>

          <p>
            Showing{" "}
            <strong>
              {filteredComplaints.length}
            </strong>{" "}
            of{" "}
            <strong>
              {complaints.length}
            </strong>{" "}
            complaints
          </p>
        </div>

        {(search ||
          statusFilter !== "ALL" ||
          priorityFilter !== "ALL") && (
          <button
            type="button"
            className="clear-filters"
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
              setPriorityFilter("ALL");
            }}
          >
            Clear Filters
          </button>
        )}

      </div>


      {/* COMPLAINTS */}

      {filteredComplaints.length === 0 ? (

        <div className="assigned-empty">

          <div className="assigned-empty-icon">
            {complaints.length === 0
              ? "✓"
              : "🔎"}
          </div>

          <h3>
            {complaints.length === 0
              ? "No complaints assigned"
              : "No complaints found"}
          </h3>

          <p>
            {complaints.length === 0
              ? "You currently have no complaints in your work queue."
              : "Try changing your search or filter options."}
          </p>

          {complaints.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
                setPriorityFilter("ALL");
              }}
            >
              Reset Filters
            </button>
          )}

        </div>

      ) : (

        <div className="assigned-complaints-list">

          {filteredComplaints.map(
            (complaint) => {

              const priority = String(
                complaint.priority || ""
              ).toUpperCase();

              const isCritical =
                priority === "CRITICAL";

              const isHigh =
                priority === "HIGH";

              return (
                <Link
                  key={
                    complaint.id ||
                    complaint.complaintNumber
                  }
                  to={`/staff/complaints/${complaint.complaintNumber}`}
                  className={`assigned-complaint-card ${
                    isCritical
                      ? "critical"
                      : isHigh
                      ? "high"
                      : ""
                  }`}
                >

                  {/* LEFT */}

                  <div className="assigned-card-main">

                    <div className="assigned-card-top">

                      <span className="assigned-number">
                        #{complaint.complaintNumber}
                      </span>

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

                    </div>


                    <h3>
                      {complaint.title ||
                        "Untitled Complaint"}
                    </h3>


                    <p className="assigned-description">
                      {complaint.description
                        ? complaint.description
                        : "No description available."}
                    </p>


                    <div className="assigned-card-details">

                      <span>
                        📁{" "}
                        {complaint.category ||
                          "General"}
                      </span>

                      <span>
                        🏢{" "}
                        {complaint.department ||
                          "Department not specified"}
                      </span>

                      <span>
                        📅{" "}
                        {complaint.createdAt
                          ? new Date(
                              complaint.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </span>

                    </div>

                  </div>


                  {/* RIGHT */}

                  <div className="assigned-card-action">

                    <span>
                      View Complaint
                    </span>

                    <strong>
                      →
                    </strong>

                  </div>

                </Link>
              );
            }
          )}

        </div>

      )}

    </div>
  );
};

export default AssignedComplaints;