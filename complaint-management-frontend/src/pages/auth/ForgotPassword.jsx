import { useState } from "react";
import { Link } from "react-router-dom";

import * as authApi from "../../api/authApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const message = await authApi.forgotPassword(
        email
      );

      setSuccess(
        message ||
          "If an account exists with this email, a password reset link has been sent."
      );

      setEmail("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to process your request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-icon">
          🔐
        </div>

        <span className="auth-eyebrow">
          ACCOUNT RECOVERY
        </span>

        <h1>
          Forgot Password?
        </h1>

        <p className="auth-description">
          Enter your registered email address
          and we'll help you reset your password.
        </p>

        {success && (
          <div className="auth-success">
            ✓ {success}
          </div>
        )}

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={submit}>

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
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>

        </form>

        <div className="auth-footer">

          <Link to="/login">
            ← Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;