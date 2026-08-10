import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

// ==========================================
// ROUTE COMPONENTS
// ==========================================

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

// ==========================================
// LAYOUTS
// ==========================================

import UserLayout from "./layouts/UserLayout";
import StaffLayout from "./layouts/StaffLayout";
import AdminLayout from "./layouts/AdminLayout";

// ==========================================
// AUTH
// ==========================================

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import LandingPage from "./pages/LandingPage";

// ==========================================
// USER PAGES
// ==========================================

import UserDashboard from "./pages/user/UserDashboard";
import CreateComplaint from "./pages/user/CreateComplaint";
import MyComplaints from "./pages/user/MyComplaints";
import ComplaintDetails from "./pages/user/ComplaintDetails";
import ComplaintHistory from "./pages/user/ComplaintHistory";
import Notifications from "./pages/user/Notifications";
import Profile from "./pages/user/Profile";

// ==========================================
// STAFF PAGES
// ==========================================

import StaffDashboard from "./pages/staff/StaffDashboard";
import AssignedComplaints from "./pages/staff/AssignedComplaints";
import StaffComplaintDetails from "./pages/staff/StaffComplaintDetails";
import StaffNotifications from "./pages/staff/StaffNotifications";
import StaffProfile from "./pages/staff/StaffProfile";

// ==========================================
// ADMIN PAGES
// ==========================================

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminComplaintDetails from "./pages/admin/AdminComplaintDetails";
import AdminComplaintHistory from "./pages/admin/AdminComplaintHistory";
import AssignComplaint from "./pages/admin/AssignComplaint";
import Departments from "./pages/admin/Departments";
import StaffManagement from "./pages/admin/StaffManagement";
import OverdueComplaints from "./pages/admin/OverdueComplaints";
import AdminNotifications from "./pages/admin/AdminNotifications";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";


// ==========================================
// UNAUTHORIZED PAGE
// ==========================================

const Unauthorized = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f9fc",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "40px",
          borderRadius: "16px",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: "60px",
            margin: "0 0 10px",
            color: "#dc2626",
          }}
        >
          403
        </h1>

        <h2>Access Denied</h2>

        <p
          style={{
            color: "#667085",
            lineHeight: "1.6",
          }}
        >
          You do not have permission to access this page.
        </p>

        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: "15px",
            padding: "12px 20px",
            borderRadius: "8px",
            background: "#2563eb",
            color: "#ffffff",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
};


// ==========================================
// NOT FOUND PAGE
// ==========================================

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f9fc",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "40px",
          borderRadius: "16px",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: "60px",
            margin: "0 0 10px",
            color: "#172033",
          }}
        >
          404
        </h1>

        <h2>Page Not Found</h2>

        <p
          style={{
            color: "#667085",
            lineHeight: "1.6",
          }}
        >
          The page you are looking for does not exist.
        </p>

        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: "15px",
            padding: "12px 20px",
            borderRadius: "8px",
            background: "#2563eb",
            color: "#ffffff",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
};


// ==========================================
// APP
// ==========================================

const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==========================================
            PUBLIC ROUTES
        ========================================== */}

        {/* Main landing page */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        {/* USER LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* USER REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/reset-password"
  element={<ResetPassword />}
/>

        {/* STAFF LOGIN */}
        <Route
          path="/staff/login"
          element={<Login />}
        />

        {/* ADMIN LOGIN */}
        <Route
          path="/admin/login"
          element={<Login />}
        />

        {/* UNAUTHORIZED */}
        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />


        {/* ==========================================
            AUTHENTICATED ROUTES
        ========================================== */}

        <Route element={<ProtectedRoute />}>


          {/* ========================================
              USER
          ======================================== */}

          <Route
            element={
              <RoleRoute
                allowedRoles={["USER"]}
              />
            }
          >

            <Route
              element={<UserLayout />}
            >

              <Route
                path="/user/dashboard"
                element={
                  <UserDashboard />
                }
              />

              <Route
                path="/user/complaints"
                element={
                  <MyComplaints />
                }
              />

              <Route
                path="/user/complaints/create"
                element={
                  <CreateComplaint />
                }
              />

              <Route
                path="/user/complaints/:complaintNumber"
                element={
                  <ComplaintDetails />
                }
              />

              <Route
                path="/user/complaints/:complaintNumber/history"
                element={
                  <ComplaintHistory />
                }
              />

              <Route
                path="/user/notifications"
                element={
                  <Notifications />
                }
              />

              <Route
                path="/user/profile"
                element={
                  <Profile />
                }
              />

            </Route>

          </Route>


          {/* ========================================
              STAFF
          ======================================== */}

          <Route
            element={
              <RoleRoute
                allowedRoles={["STAFF"]}
              />
            }
          >

            <Route
              element={<StaffLayout />}
            >

              <Route
                path="/staff/dashboard"
                element={
                  <StaffDashboard />
                }
              />

              <Route
                path="/staff/complaints"
                element={
                  <AssignedComplaints />
                }
              />

              <Route
                path="/staff/complaints/:complaintNumber"
                element={
                  <StaffComplaintDetails />
                }
              />

              <Route
                path="/staff/notifications"
                element={
                  <StaffNotifications />
                }
              />

              <Route
                path="/staff/profile"
                element={
                  <StaffProfile />
                }
              />

            </Route>

          </Route>


          {/* ========================================
              ADMIN
          ======================================== */}

          <Route
            element={
              <RoleRoute
                allowedRoles={["ADMIN"]}
              />
            }
          >

            <Route
              element={<AdminLayout />}
            >

              <Route
                path="/admin/dashboard"
                element={
                  <AdminDashboard />
                }
              />

              <Route
                path="/admin/complaints"
                element={
                  <AdminComplaints />
                }
              />

              <Route
                path="/admin/complaints/:complaintNumber"
                element={
                  <AdminComplaintDetails />
                }
              />

              <Route
                path="/admin/complaints/:complaintNumber/history"
                element={
                  <AdminComplaintHistory />
                }
              />

              <Route
                path="/admin/complaints/:complaintNumber/assign"
                element={
                  <AssignComplaint />
                }
              />

              <Route
                path="/admin/departments"
                element={
                  <Departments />
                }
              />

              <Route
                path="/admin/staff"
                element={
                  <StaffManagement />
                }
              />

              <Route
                path="/admin/overdue"
                element={
                  <OverdueComplaints />
                }
              />

              <Route
                path="/admin/notifications"
                element={
                  <AdminNotifications />
                }
              />

            </Route>

          </Route>

        </Route>


        {/* ==========================================
            FALLBACK
        ========================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
};

export default App;