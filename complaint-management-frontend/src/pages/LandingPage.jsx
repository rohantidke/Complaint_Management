import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="landing-page">

      {/* HEADER */}
      <header className="landing-header">

        <div className="landing-brand">
          <div className="landing-logo">
            CR
          </div>

          <div>
            <h1>Complaint Registration</h1>
            <span>Management System</span>
          </div>
        </div>

        <div className="landing-header-actions">
          <Link
            to="/login"
            className="landing-login-link"
          >
            User Login
          </Link>

          <Link
            to="/register"
            className="landing-register-link"
          >
            Register
          </Link>
        </div>

      </header>


      {/* HERO */}
      <main className="landing-main">

        <section className="landing-hero">

          <div className="landing-hero-content">

            <div className="landing-badge">
              Complaint Registration Management System
            </div>

            <h2>
              Raise Complaints.
              <br />
              Track Progress.
              <br />
              Get Resolution.
            </h2>

            <p>
              A centralized platform for registering complaints,
              tracking their progress, managing assignments and
              resolving issues efficiently.
            </p>

            <div className="landing-actions">

              <Link
                to="/register"
                className="landing-primary-btn"
              >
                Register as User
              </Link>

              <Link
                to="/login"
                className="landing-secondary-btn"
              >
                User Login
              </Link>

            </div>

          </div>


          {/* LOGIN PANEL */}
          <div className="landing-login-panel">

            <div className="panel-header">
              <span className="panel-icon">🔐</span>

              <div>
                <h3>System Access</h3>
                <p>Select your login portal</p>
              </div>
            </div>


            {/* USER */}
            <Link
              to="/login"
              className="portal-card"
            >
              <div className="portal-icon user-icon">
                👤
              </div>

              <div className="portal-info">
                <strong>User Login</strong>

                <span>
                  Raise and track your complaints
                </span>
              </div>

              <span className="portal-arrow">
                →
              </span>
            </Link>


            {/* STAFF */}
            <Link
              to="/staff/login"
              className="portal-card"
            >
              <div className="portal-icon staff-icon">
                👨‍💼
              </div>

              <div className="portal-info">
                <strong>Staff Login</strong>

                <span>
                  Manage assigned complaints
                </span>
              </div>

              <span className="portal-arrow">
                →
              </span>
            </Link>


            {/* ADMIN */}
            <Link
              to="/admin/login"
              className="portal-card"
            >
              <div className="portal-icon admin-icon">
                🛡️
              </div>

              <div className="portal-info">
                <strong>Admin Login</strong>

                <span>
                  Manage the complete system
                </span>
              </div>

              <span className="portal-arrow">
                →
              </span>
            </Link>

          </div>

        </section>


        {/* FEATURES */}
        <section className="landing-features">

          <div className="feature-card">

            <div className="feature-icon">
              📝
            </div>

            <h3>Easy Registration</h3>

            <p>
              Register your complaint quickly with
              all required information.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🔍
            </div>

            <h3>Track Complaints</h3>

            <p>
              Follow complaint status and view
              complete complaint history.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              ⚡
            </div>

            <h3>Fast Resolution</h3>

            <p>
              Staff can manage assigned complaints
              and update their progress.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🔒
            </div>

            <h3>Secure Access</h3>

            <p>
              Separate secure portals are available
              for users, staff and administrators.
            </p>

          </div>

        </section>

      </main>


      {/* FOOTER */}
      <footer className="landing-footer">

        <span>
          © {new Date().getFullYear()}
          {" "}
          Complaint Registration Management System
        </span>

        <span>
          Secure Complaint Management Platform
        </span>

      </footer>

    </div>
  );
};

export default LandingPage;