import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ErrorMessage from "../../components/ErrorMessage";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear old messages while typing
    if (error) {
      setError(null);
    }

    if (success) {
      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess("");

    // Frontend validation
    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!form.password) {
      setError("Please enter a password.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      };

      const response = await register(requestData);

      const message =
        typeof response === "string"
          ? response
          : "Registration successful!";

      setSuccess(message);

      // Clear form
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
      });

      // Redirect after successful registration
      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Registration failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="register-card">

          {/* ================= BRAND ================= */}

          <div className="auth-brand">
            <div className="auth-logo">
              CM
            </div>

            <div className="auth-brand-text">
              <h1>
                Complaint Registration
              </h1>

              <p>
                Management System
              </p>
            </div>
          </div>

          {/* ================= HEADING ================= */}

          <div className="auth-heading">
            <h2>
              Create Your Account
            </h2>

            <p>
              Register to raise and track your complaints.
            </p>
          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <div className="auth-error">
              <ErrorMessage error={error} />
            </div>
          )}

          {/* ================= SUCCESS ================= */}

          {success && (
            <div className="auth-success">
              <span className="success-icon">
                ✓
              </span>

              <div>
                <strong>
                  Registration successful
                </strong>

                <p>
                  {success}
                </p>

                <small>
                  Redirecting you to login...
                </small>
              </div>
            </div>
          )}

          {/* ================= FORM ================= */}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* NAME */}

            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={loading}
                required
              />

            </div>

            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                autoComplete="email"
                disabled={loading}
                required
              />

            </div>

            {/* PHONE */}

            <div className="form-group">

              <label htmlFor="phone">
                Phone Number
                <span className="optional">
                  Optional
                </span>
              </label>

              <input
                id="phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                autoComplete="tel"
                disabled={loading}
              />

            </div>

            {/* PASSWORD */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="password-wrapper">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

              <div className="password-hint">
                Password must contain at least 6 characters.
              </div>

            </div>

            {/* REGISTER BUTTON */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

          </form>

          {/* ================= LOGIN ================= */}

          <div className="register-section">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign In
            </Link>

          </div>

          {/* ================= OTHER LOGIN ================= */}

          <div className="login-options">

            <div className="login-divider">
              <span>
                Other login options
              </span>
            </div>

            <div className="login-option-buttons">

              <Link
                to="/staff/login"
                className="login-option"
              >
                Staff Login
              </Link>

              <Link
                to="/admin/login"
                className="login-option"
              >
                Admin Login
              </Link>

            </div>

          </div>

          {/* ================= SECURITY ================= */}

          <div className="auth-security">

            <span className="security-icon">
              🔒
            </span>

            <span>
              Your information is protected.
              Never share your password with anyone.
            </span>

          </div>

          {/* ================= FOOTER ================= */}

          <div className="auth-footer">
            Complaint Registration Management System
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;