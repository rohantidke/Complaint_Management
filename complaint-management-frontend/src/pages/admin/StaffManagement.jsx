import { useEffect, useMemo, useState } from "react";

import * as staffApi from "../../api/staffApi";
import * as departmentApi from "../../api/departmentApi";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    departmentId: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] =
    useState("ALL");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setError(null);

      const [staffData, departmentData] =
        await Promise.all([
          staffApi.getAllStaff(),
          departmentApi.getActiveDepartments(),
        ]);

      setStaff(
        Array.isArray(staffData)
          ? staffData
          : []
      );

      setDepartments(
        Array.isArray(departmentData)
          ? departmentData
          : []
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load staff."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORM
  // ==========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      email: "",
      password: "",
      phone: "",
      departmentId: "",
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setError(null);

      const data = {
        ...form,
        departmentId: Number(
          form.departmentId
        ),
      };

      if (editingId) {
        await staffApi.updateStaff(
          editingId,
          data
        );
      } else {
        await staffApi.createStaff(data);
      }

      resetForm();

      await load();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save staff."
      );
    }
  };

  // ==========================================
  // EDIT
  // ==========================================

  const edit = (person) => {
    setEditingId(person.id);

    setForm({
      name: person.name || "",
      email: person.email || "",
      password: "",
      phone: person.phone || "",
      departmentId:
        person.departmentId || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // ACTIVATE / DEACTIVATE
  // ==========================================

  const toggleStaff = async (person) => {
    const isEnabled = person.enabled;

    const action = isEnabled
      ? "deactivate"
      : "activate";

    if (
      !window.confirm(
        `Are you sure you want to ${action} ${person.name}?`
      )
    ) {
      return;
    }

    try {
      setError(null);

      if (isEnabled) {
        await staffApi.deactivateStaff(
          person.id
        );
      } else {
        await staffApi.activateStaff(
          person.id
        );
      }

      await load();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          `Unable to ${action} staff.`
      );
    }
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalStaff = staff.length;

  const activeStaff = staff.filter(
    (person) => person.enabled
  ).length;

  const inactiveStaff =
    totalStaff - activeStaff;

  // ==========================================
  // FILTER
  // ==========================================

  const filteredStaff = useMemo(() => {
    return staff.filter((person) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        person.name
          ?.toLowerCase()
          .includes(searchText) ||
        person.email
          ?.toLowerCase()
          .includes(searchText);

      const matchesDepartment =
        departmentFilter === "ALL" ||
        String(person.departmentId) ===
          String(departmentFilter);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" &&
          person.enabled) ||
        (statusFilter === "INACTIVE" &&
          !person.enabled);

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    staff,
    search,
    departmentFilter,
    statusFilter,
  ]);

  // ==========================================
  // INITIALS
  // ==========================================

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase()
      )
      .join("");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return <Loading />;
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="staff-management-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="staff-page-header">

        <div>
          <span className="staff-eyebrow">
            ADMINISTRATION
          </span>

          <h1>Staff Management</h1>

          <p>
            Manage your staff members,
            departments and account access.
          </p>
        </div>

        <button
          className="staff-add-button"
          onClick={() => {
            resetForm();

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          + Add Staff
        </button>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="staff-error">
          <ErrorMessage error={error} />
        </div>
      )}


      {/* ======================================
          STATISTICS
      ====================================== */}

      <div className="staff-stat-grid">

        <div className="staff-stat-card">

          <div className="staff-stat-icon">
            👥
          </div>

          <div>
            <span>Total Staff</span>
            <strong>{totalStaff}</strong>
          </div>

        </div>


        <div className="staff-stat-card">

          <div className="staff-stat-icon active">
            ✓
          </div>

          <div>
            <span>Active Staff</span>
            <strong>{activeStaff}</strong>
          </div>

        </div>


        <div className="staff-stat-card">

          <div className="staff-stat-icon inactive">
            !
          </div>

          <div>
            <span>Inactive Staff</span>
            <strong>{inactiveStaff}</strong>
          </div>

        </div>

      </div>


      {/* ======================================
          FORM
      ====================================== */}

      <div className="staff-form-card">

        <div className="staff-form-header">

          <div>
            <h2>
              {editingId
                ? "Update Staff Member"
                : "Add New Staff Member"}
            </h2>

            <p>
              {editingId
                ? "Update staff account information."
                : "Create a new staff account and assign a department."}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              className="staff-cancel-link"
              onClick={resetForm}
            >
              Cancel editing
            </button>
          )}

        </div>


        <form onSubmit={submit}>

          <div className="staff-form-grid">

            <div className="staff-input-group">
              <label>Full Name</label>

              <input
                name="name"
                placeholder="Enter staff name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>


            <div className="staff-input-group">
              <label>Email Address</label>

              <input
                name="email"
                type="email"
                placeholder="staff@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>


            <div className="staff-input-group">
              <label>Password</label>

              <input
                name="password"
                type="password"
                placeholder={
                  editingId
                    ? "New password (optional)"
                    : "Enter password"
                }
                value={form.password}
                onChange={handleChange}
                required={!editingId}
              />
            </div>


            <div className="staff-input-group">
              <label>Phone</label>

              <input
                name="phone"
                placeholder="Phone number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>


            <div className="staff-input-group">
              <label>Department</label>

              <select
                name="departmentId"
                value={form.departmentId}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Department
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

          </div>


          <div className="staff-form-actions">

            <button
              type="submit"
              className="staff-save-button"
            >
              {editingId
                ? "✓ Update Staff"
                : "+ Create Staff"}
            </button>

            {editingId && (
              <button
                type="button"
                className="staff-secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>


      {/* ======================================
          STAFF LIST
      ====================================== */}

      <div className="staff-list-card">

        <div className="staff-list-header">

          <div>
            <h2>Staff Members</h2>

            <p>
              {filteredStaff.length} staff member
              {filteredStaff.length !== 1
                ? "s"
                : ""}{" "}
              shown
            </p>
          </div>

        </div>


        {/* FILTERS */}

        <div className="staff-filters">

          <div className="staff-search">

            <span>🔎</span>

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <select
            value={departmentFilter}
            onChange={(e) =>
              setDepartmentFilter(
                e.target.value
              )
            }
          >
            <option value="ALL">
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


          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="ALL">
              All Status
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>

          </select>

        </div>


        {/* TABLE */}

        <div className="staff-table-wrapper">

          <table className="staff-table">

            <thead>

              <tr>
                <th>Staff Member</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>


            <tbody>

              {filteredStaff.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="staff-empty"
                  >

                    <div className="staff-empty-icon">
                      👥
                    </div>

                    <h3>
                      No staff members found
                    </h3>

                    <p>
                      Try changing your search
                      or filters.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredStaff.map(
                  (person) => (

                    <tr key={person.id}>

                      {/* STAFF */}

                      <td>

                        <div className="staff-person">

                          <div className="staff-avatar">
                            {getInitials(
                              person.name
                            )}
                          </div>

                          <div>

                            <strong>
                              {person.name}
                            </strong>

                            <span>
                              {person.email}
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* DEPARTMENT */}

                      <td>

                        <span className="department-pill">
                          {person.departmentName ||
                            "Unassigned"}
                        </span>

                      </td>


                      {/* ROLE */}

                      <td>

                        <span className="role-pill">
                          {person.role}
                        </span>

                      </td>


                      {/* STATUS */}

                      <td>

                        {person.enabled ? (

                          <span className="status-badge active">
                            <span />
                            Active
                          </span>

                        ) : (

                          <span className="status-badge inactive">
                            <span />
                            Inactive
                          </span>

                        )}

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="staff-actions">

                          <button
                            type="button"
                            className="edit-staff-btn"
                            onClick={() =>
                              edit(person)
                            }
                          >
                            ✏️ Edit
                          </button>


                          <button
                            type="button"
                            className={
                              person.enabled
                                ? "deactivate-staff-btn"
                                : "activate-staff-btn"
                            }
                            onClick={() =>
                              toggleStaff(person)
                            }
                          >
                            {person.enabled
                              ? "Deactivate"
                              : "Activate"}
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default StaffManagement;