import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import * as authApi from "../../api/authApi";

const ResetPassword = () => {
  const [searchParams] =
    useSearchParams();

  const token =
    searchParams.get("token");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const submit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!token) {
      setError(
        "Invalid or missing password reset token."
      );

      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );

      return;
    }

    if (
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    try {
      setLoading(true);

      const message =
        await authApi.resetPassword(
          token,
          password,
          confirmPassword
        );

      setSuccess(
        message ||
          "Password reset successfully."
      );

      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-icon">
          🔑
        </div>

        <span className="auth-eyebrow">
          PASSWORD RECOVERY
        </span>

        <h1>
          Reset Password
        </h1>

        <p className="auth-description">
          Create a new password for your
          account.
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success">
            ✓ {success}
          </div>
        )}

        {!success && (
          <form onSubmit={submit}>

            <label htmlFor="password">
              New Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              minLength={6}
              required
            />

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              minLength={6}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading
                ? "Resetting..."
                : "Reset Password"}
            </button>

          </form>
        )}

        <div className="auth-footer">

          <Link to="/login">
            ← Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
};

export default ResetPassword;