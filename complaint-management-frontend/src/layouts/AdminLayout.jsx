import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => {
  return (
    <>
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;