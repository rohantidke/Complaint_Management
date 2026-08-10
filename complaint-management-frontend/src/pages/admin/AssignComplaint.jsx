import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import * as departmentApi from "../../api/departmentApi";
import * as staffApi from "../../api/staffApi";
import * as adminApi from "../../api/adminApi";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

const AssignComplaint = () => {
  const { complaintNumber } = useParams();
  const navigate = useNavigate();

  const [departments, setDepartments] =
    useState([]);

  const [staff, setStaff] = useState([]);

  const [departmentId, setDepartmentId] =
    useState("");

  const [staffId, setStaffId] =
    useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const result =
        await departmentApi.getActiveDepartments();

      setDepartments(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = async (
    e
  ) => {
    const id = e.target.value;

    setDepartmentId(id);
    setStaffId("");

    if (!id) {
      setStaff([]);
      return;
    }

    try {
      const result =
        await staffApi.getStaffByDepartment(
          id
        );

      setStaff(
        result.filter(
          (person) => person.enabled
        )
      );
    } catch (err) {
      setError(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!departmentId || !staffId) {
      setError({
        message:
          "Please select department and staff",
      });

      return;
    }

    setSaving(true);
    setError(null);

    try {
      await adminApi.assignComplaint(
        complaintNumber,
        {
          departmentId: Number(
            departmentId
          ),
          staffId: Number(staffId),
        }
      );

      navigate(
        `/admin/complaints/${complaintNumber}`
      );
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>Assign Complaint</h1>

      <p>
        Complaint:{" "}
        <strong>{complaintNumber}</strong>
      </p>

      <ErrorMessage error={error} />

      <form
        className="form-card"
        onSubmit={handleSubmit}
      >
        <label>Department</label>

        <select
          value={departmentId}
          onChange={
            handleDepartmentChange
          }
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

        <label>Staff</label>

        <select
          value={staffId}
          onChange={(e) =>
            setStaffId(e.target.value)
          }
          disabled={!departmentId}
          required
        >
          <option value="">
            Select Staff
          </option>

          {staff.map((person) => (
            <option
              key={person.id}
              value={person.id}
            >
              {person.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Assigning..."
            : "Assign Complaint"}
        </button>
      </form>
    </div>
  );
};

export default AssignComplaint;