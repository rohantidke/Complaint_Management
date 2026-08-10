import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  const name = user?.name || "User";
  const email = user?.email || "-";
  const role = user?.role || "USER";

  const initials = useMemo(() => {
    const value = name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");

    return value || "U";
  }, [name]);

  const formattedRole =
    role === "USER"
      ? "Registered User"
      : role;

  return (
    <div className="profile-page">

      {/* TOP BAR */}
      <div className="profile-page-header">

        <div>
          <span className="profile-eyebrow">
            ACCOUNT
          </span>

          <h1>My Profile</h1>

          <p>
            Manage your account and view your
            registered information.
          </p>
        </div>

        <Link
          to="/user/dashboard"
          className="profile-back-button"
        >
          <span>←</span>
          Dashboard
        </Link>

      </div>

      {/* HERO PROFILE */}
      <section className="profile-hero">

        <div className="profile-hero-glow" />

        <div className="profile-hero-content">

          <div className="profile-avatar-large">
            {initials}

            <span className="profile-online-dot" />
          </div>

          <div className="profile-hero-info">

            <div className="profile-name-row">

              <h2>{name}</h2>

              <span className="profile-verified">
                ✓ Verified
              </span>

            </div>

            <p className="profile-email">
              {email}
            </p>

            <div className="profile-meta">

              <span className="profile-role-pill">
                👤 {formattedRole}
              </span>

              <span className="profile-status-pill">
                <span />
                Active Account
              </span>

            </div>

          </div>

        </div>

        <div className="profile-member-card">

          <span>ACCOUNT STATUS</span>

          <strong>Active</strong>

          <small>
            Secure & authenticated
          </small>

        </div>

      </section>

      {/* MAIN GRID */}
      <div className="profile-main-grid">

        {/* ACCOUNT INFORMATION */}
        <section className="profile-card">

          <div className="profile-card-heading">

            <div className="profile-card-icon blue">
              👤
            </div>

            <div>
              <h3>Account Information</h3>

              <p>
                Your registered account details
              </p>
            </div>

          </div>

          <div className="profile-information-grid">

            <div className="profile-information-item">

              <span>
                Full Name
              </span>

              <strong>
                {name}
              </strong>

            </div>

            <div className="profile-information-item">

              <span>
                Email Address
              </span>

              <strong className="profile-email-value">
                {email}
              </strong>

            </div>

            <div className="profile-information-item">

              <span>
                Account Role
              </span>

              <strong>
                {formattedRole}
              </strong>

            </div>

            <div className="profile-information-item">

              <span>
                Account Status
              </span>

              <strong className="profile-active-text">
                ● Active
              </strong>

            </div>

          </div>

        </section>

        {/* SECURITY */}
        <section className="profile-card security-card">

          <div className="profile-card-heading">

            <div className="profile-card-icon green">
              🔒
            </div>

            <div>
              <h3>Account Security</h3>

              <p>
                Your account is protected
              </p>
            </div>

          </div>

          <div className="security-content">

            <div className="security-status">

              <div className="security-check">
                ✓
              </div>

              <div>
                <strong>
                  Account secured
                </strong>

                <span>
                  Authenticated access is enabled
                </span>
              </div>

            </div>

            <div className="security-message">
              <span>🛡️</span>

              <p>
                Never share your password or login
                credentials with anyone.
              </p>
            </div>

          </div>

        </section>

      </div>

      {/* QUICK ACTIONS */}
      <section className="profile-actions-section">

        <div className="profile-section-heading">

          <div>
            <span className="profile-eyebrow">
              SHORTCUTS
            </span>

            <h2>Quick Actions</h2>

            <p>
              Quickly access the features you use most.
            </p>
          </div>

        </div>

        <div className="profile-action-grid">

          {/* COMPLAINTS */}
          <Link
            to="/user/complaints"
            className="profile-action"
          >

            <div className="profile-action-icon blue">
              📋
            </div>

            <div className="profile-action-content">
              <h3>My Complaints</h3>

              <p>
                View and track all your submitted
                complaints.
              </p>
            </div>

            <span className="profile-action-arrow">
              →
            </span>

          </Link>

          {/* CREATE */}
          <Link
            to="/user/complaints/create"
            className="profile-action"
          >

            <div className="profile-action-icon purple">
              📝
            </div>

            <div className="profile-action-content">
              <h3>Raise Complaint</h3>

              <p>
                Submit a new complaint to the
                appropriate department.
              </p>
            </div>

            <span className="profile-action-arrow">
              →
            </span>

          </Link>

          {/* NOTIFICATIONS */}
          <Link
            to="/user/notifications"
            className="profile-action"
          >

            <div className="profile-action-icon orange">
              🔔
            </div>

            <div className="profile-action-content">
              <h3>Notifications</h3>

              <p>
                Stay updated with your complaint
                activity.
              </p>
            </div>

            <span className="profile-action-arrow">
              →
            </span>

          </Link>

          {/* DASHBOARD */}
          <Link
            to="/user/dashboard"
            className="profile-action"
          >

            <div className="profile-action-icon green">
              📊
            </div>

            <div className="profile-action-content">
              <h3>Dashboard</h3>

              <p>
                View your complaint summary and
                recent activity.
              </p>
            </div>

            <span className="profile-action-arrow">
              →
            </span>

          </Link>

        </div>

      </section>

      {/* SECURITY NOTICE */}
      <section className="profile-notice">

        <div className="profile-notice-icon">
          🔐
        </div>

        <div>
          <h3>
            Your privacy matters
          </h3>

          <p>
            Your account information is securely
            handled by the Complaint Registration
            Management System. Keep your login
            credentials private.
          </p>
        </div>

      </section>

      {/* LOGOUT */}
      <div className="profile-logout-area">

        <button
          type="button"
          className="profile-logout-button"
          onClick={logout}
        >
          <span>↪</span>
          Sign Out
        </button>

      </div>

    </div>
  );
};

export default Profile;