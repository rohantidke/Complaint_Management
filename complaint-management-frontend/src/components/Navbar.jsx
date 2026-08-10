import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          Complaint Management System
        </Link>
      </div>

      <div className="navbar-right">
        {user && (
          <>
            <span className="user-name">
              {user.name || user.email}
            </span>

            <span className="user-role">
              {user.role}
            </span>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;