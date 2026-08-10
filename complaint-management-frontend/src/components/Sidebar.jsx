import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const linkClass = ({ isActive }) =>
    isActive
      ? "sidebar-link active"
      : "sidebar-link";

  return (
    <aside className="sidebar">

      {user.role === "USER" && (
        <>
          <NavLink
            to="/user/dashboard"
            className={linkClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/user/complaints"
            className={linkClass}
          >
            My Complaints
          </NavLink>

          <NavLink
            to="/user/complaints/create"
            className={linkClass}
          >
            Create Complaint
          </NavLink>

          <NavLink
            to="/user/notifications"
            className={linkClass}
          >
            Notifications
          </NavLink>

          <NavLink
            to="/user/profile"
            className={linkClass}
          >
            Profile
          </NavLink>
        </>
      )}

      {user.role === "STAFF" && (
        <>
          <NavLink
            to="/staff/dashboard"
            className={linkClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/staff/complaints"
            className={linkClass}
          >
            Assigned Complaints
          </NavLink>

          <NavLink
            to="/staff/notifications"
            className={linkClass}
          >
            Notifications
          </NavLink>

          <NavLink
            to="/staff/profile"
            className={linkClass}
          >
            Profile
          </NavLink>
        </>
      )}

      {user.role === "ADMIN" && (
        <>
          <NavLink
            to="/admin/dashboard"
            className={linkClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/complaints"
            className={linkClass}
          >
            Complaints
          </NavLink>

          <NavLink
            to="/admin/overdue"
            className={linkClass}
          >
            Overdue
          </NavLink>

          <NavLink
            to="/admin/departments"
            className={linkClass}
          >
            Departments
          </NavLink>

          <NavLink
            to="/admin/staff"
            className={linkClass}
          >
            Staff
          </NavLink>

          <NavLink
            to="/admin/notifications"
            className={linkClass}
          >
            Notifications
          </NavLink>
        </>
      )}
    </aside>
  );
};

export default Sidebar;