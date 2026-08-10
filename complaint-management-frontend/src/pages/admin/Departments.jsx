import { useEffect, useState } from "react";

import * as departmentApi from "../../api/departmentApi";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

const Departments = () => {
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  // ==========================================
  // LOAD DEPARTMENTS
  // ==========================================

  const loadDepartments = async () => {
    try {
      setError(null);

      const data = await departmentApi.getDepartments();

      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      description: "",
    });

    setError(null);
  };

  // ==========================================
  // CREATE / UPDATE
  // ==========================================

  const submit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      if (editingId) {
        await departmentApi.updateDepartment(
          editingId,
          form
        );
      } else {
        await departmentApi.createDepartment(form);
      }

      resetForm();
      await loadDepartments();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT
  // ==========================================

  const editDepartment = (department) => {
    setEditingId(department.id);

    setForm({
      name: department.name || "",
      description: department.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // ACTIVATE / DEACTIVATE
  // ==========================================

  const toggleDepartment = async (department) => {
    const action = department.active
      ? "deactivate"
      : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${department.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      if (department.active) {
        await departmentApi.deactivateDepartment(
          department.id
        );
      } else {
        await departmentApi.activateDepartment(
          department.id
        );
      }

      await loadDepartments();
    } catch (err) {
      setError(err);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return <Loading />;
  }

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalDepartments = departments.length;

  const activeDepartments = departments.filter(
    (department) => department.active
  ).length;

  const inactiveDepartments = departments.filter(
    (department) => !department.active
  ).length;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="department-management-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="department-page-header">

        <div>
          <span className="department-eyebrow">
            ADMINISTRATION
          </span>

          <h1>Department Management</h1>

          <p>
            Create, update and manage departments
            across the complaint system.
          </p>
        </div>

        <div className="department-header-icon">
          🏢
        </div>

      </div>

      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="department-error">
          <ErrorMessage error={error} />
        </div>
      )}

      {/* =====================================
          STATISTICS
      ===================================== */}

      <div className="department-stats">

        <div className="department-stat-card">
          <div className="department-stat-icon blue">
            🏢
          </div>

          <div>
            <span>Total Departments</span>
            <strong>{totalDepartments}</strong>
          </div>
        </div>

        <div className="department-stat-card">
          <div className="department-stat-icon green">
            ✓
          </div>

          <div>
            <span>Active</span>
            <strong>{activeDepartments}</strong>
          </div>
        </div>

        <div className="department-stat-card">
          <div className="department-stat-icon red">
            ⏸
          </div>

          <div>
            <span>Inactive</span>
            <strong>{inactiveDepartments}</strong>
          </div>
        </div>

      </div>

      {/* =====================================
          MAIN GRID
      ===================================== */}

      <div className="department-management-grid">

        {/* ===================================
            CREATE / UPDATE FORM
        =================================== */}

        <section className="department-form-card">

          <div className="department-card-header">

            <div className="department-card-icon">
              {editingId ? "✏️" : "+"}
            </div>

            <div>
              <h2>
                {editingId
                  ? "Update Department"
                  : "Create Department"}
              </h2>

              <p>
                {editingId
                  ? "Update the department details below."
                  : "Add a new department to the system."}
              </p>
            </div>

          </div>

          <form onSubmit={submit}>

            {/* NAME */}

            <div className="department-form-group">

              <label htmlFor="department-name">
                Department Name
              </label>

              <input
                id="department-name"
                name="name"
                type="text"
                placeholder="e.g. Public Works"
                value={form.name}
                onChange={handleChange}
                required
              />

            </div>

            {/* DESCRIPTION */}

            <div className="department-form-group">

              <label htmlFor="department-description">
                Description
              </label>

              <textarea
                id="department-description"
                name="description"
                placeholder="Brief description of this department..."
                value={form.description}
                onChange={handleChange}
                rows="5"
              />

            </div>

            {/* BUTTONS */}

            <div className="department-form-actions">

              <button
                type="submit"
                className="department-primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Save Changes"
                  : "Create Department"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="department-secondary-button"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>

        {/* ===================================
            DEPARTMENT LIST
        =================================== */}

        <section className="department-list-card">

          <div className="department-list-header">

            <div>
              <h2>All Departments</h2>

              <p>
                Manage department status and details.
              </p>
            </div>

            <span className="department-count">
              {totalDepartments}
            </span>

          </div>

          {departments.length === 0 ? (

            <div className="department-empty">

              <div className="department-empty-icon">
                🏢
              </div>

              <h3>No departments yet</h3>

              <p>
                Create your first department using
                the form.
              </p>

            </div>

          ) : (

            <div className="department-list">

              {departments.map((department) => (

                <div
                  className={`department-item ${
                    department.active
                      ? ""
                      : "department-item-inactive"
                  }`}
                  key={department.id}
                >

                  {/* ICON */}

                  <div className="department-item-icon">
                    🏢
                  </div>

                  {/* DETAILS */}

                  <div className="department-item-content">

                    <div className="department-name-row">

                      <h3>
                        {department.name}
                      </h3>

                      <span
                        className={`department-status ${
                          department.active
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {department.active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>

                    <p>
                      {department.description ||
                        "No description available."}
                    </p>

                  </div>

                  {/* ACTIONS */}

                  <div className="department-item-actions">

                    <button
                      type="button"
                      className="department-edit-button"
                      onClick={() =>
                        editDepartment(department)
                      }
                    >
                      ✏️ Edit
                    </button>

                    <button
                      type="button"
                      className={
                        department.active
                          ? "department-deactivate-button"
                          : "department-activate-button"
                      }
                      onClick={() =>
                        toggleDepartment(department)
                      }
                    >
                      {department.active
                        ? "⏸ Deactivate"
                        : "✓ Activate"}
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </div>

    </div>
  );
};

export default Departments;