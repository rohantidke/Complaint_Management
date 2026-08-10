import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import ErrorMessage from "../../components/ErrorMessage";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // --------------------------------------------------
  // LOGIN TYPE
  // --------------------------------------------------

  const isStaffLogin = location.pathname === "/staff/login";
  const isAdminLogin = location.pathname === "/admin/login";

  const loginType = isAdminLogin
    ? "ADMIN"
    : isStaffLogin
      ? "STAFF"
      : "USER";

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);


  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // TEXT
  // --------------------------------------------------

  const title =
    loginType === "ADMIN"
      ? "Admin Login"
      : loginType === "STAFF"
        ? "Staff Login"
        : "User Login";

  const subtitle =
    loginType === "ADMIN"
      ? "Sign in to manage the complaint system."
      : loginType === "STAFF"
        ? "Sign in to manage your assigned complaints."
        : "Sign in to raise and track your complaints.";

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await login(cleanEmail, password);

      const storedUser = JSON.parse(
        localStorage.getItem("complaint_user") || "null"
      );

      const role = response?.role || storedUser?.role;

      if (!role) {
        throw new Error(
          "Login successful, but user role was not received."
        );
      }

      // ------------------------------------------------
      // PREVENT WRONG LOGIN PAGE
      // ------------------------------------------------

      if (loginType === "ADMIN" && role !== "ADMIN") {
        throw new Error(
          "This login page is only for administrators."
        );
      }

      if (loginType === "STAFF" && role !== "STAFF") {
        throw new Error(
          "This login page is only for staff members."
        );
      }

      if (loginType === "USER" && role !== "USER") {
        throw new Error(
          "Please use the appropriate Staff or Admin login."
        );
      }

      // ------------------------------------------------
      // REDIRECT
      // ------------------------------------------------

      if (role === "ADMIN") {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else if (role === "STAFF") {
        navigate("/staff/dashboard", {
          replace: true,
        });
      } else if (role === "USER") {
        navigate("/user/dashboard", {
          replace: true,
        });
      } else {
        throw new Error(
          "Unknown user role. Please contact the administrator."
        );
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed. Please check your credentials.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* =========================================
            BRAND
        ========================================= */}

        <div className="auth-brand">
          <div className="auth-logo">
            CRMS
          </div>

          <div className="auth-brand-text">
            <h1>
              Complaint Registrationn
            </h1>

            <p>
              Management System
            </p>
          </div>
        </div>

        {/* =========================================
            LOGIN CARD
        ========================================= */}

        <div className="auth-card">

          {/* HEADER */}

          <div className="auth-heading">
            <h2>{title}</h2>

            <p>{subtitle}</p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="auth-error">
              <ErrorMessage error={error} />
            </div>
          )}

          {/* =======================================
              LOGIN FORM
          ======================================= */}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
                disabled={loading}
                required
              />

            </div>

            {/* PASSWORD */}
{/* PASSWORD */}

<div className="form-group">

  <div className="password-label-row">

    <label htmlFor="password">
      Password
    </label>

    <Link
      to="/forgot-password"
      className="forgot-password-link"
    >
      Forgot password?
    </Link>

  </div>

  <div className="input-wrapper">

    <span className="input-icon">
      🔒
    </span>

    <input
      id="password"
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
      value={password}
      onChange={(e) =>
        setPassword(e.target.value)
      }
      autoComplete="current-password"
      disabled={loading}
      required
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() =>
        setShowPassword((previous) => !previous)
      }
      disabled={loading}
      aria-label={
        showPassword
          ? "Hide password"
          : "Show password"
      }
    >
      {showPassword ? "🙈" : "👁"}
    </button>

  </div>

</div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="button-loading">
                  <span className="spinner"></span>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

          </form>

          {/* =======================================
              USER REGISTRATION
          ======================================= */}

          {loginType === "USER" && (
            <div className="register-section">

              <span>
                Don't have an account?
              </span>

              <Link to="/register">
                Create an account
              </Link>

            </div>
          )}

          {/* =======================================
              OTHER LOGIN OPTIONS
          ======================================= */}

          <div className="login-options">

            <div className="login-divider">
              <span>
                Other login options
              </span>
            </div>

            <div className="login-option-buttons">

              {/* USER LOGIN */}

              {loginType !== "USER" && (
                <Link
                  to="/login"
                  className="login-option user-option"
                >
                  <span className="login-option-icon">
                    👤
                  </span>

                  <span>
                    User Login
                  </span>
                </Link>
              )}

              {/* STAFF LOGIN */}

              {loginType !== "STAFF" && (
                <Link
                  to="/staff/login"
                  className="login-option staff-option"
                >
                  <span className="login-option-icon">
                    👨‍💼
                  </span>

                  <span>
                    Staff Login
                  </span>
                </Link>
              )}

              {/* ADMIN LOGIN */}

              {loginType !== "ADMIN" && (
                <Link
                  to="/admin/login"
                  className="login-option admin-option"
                >
                  <span className="login-option-icon">
                    🛡️
                  </span>

                  <span>
                    Admin Login
                  </span>
                </Link>
              )}

            </div>
          </div>

          {/* =======================================
              SECURITY MESSAGE
          ======================================= */}

          <div className="auth-security">

            <span className="security-icon">
              🔒
            </span>

            <div>
              <strong>
                Secure Login
              </strong>

              <p>
                Your connection is protected.
                Never share your password with anyone.
              </p>
            </div>

          </div>

        </div>

        {/* =========================================
            FOOTER
        ========================================= */}

        <div className="auth-footer">

          <span>
            Complaint Registration Management System
          </span>

          <span className="footer-separator">
            •
          </span>

          <span>
            Secure & Reliable
          </span>

        </div>

      </div>
    </div>
  );
};

export default Login;