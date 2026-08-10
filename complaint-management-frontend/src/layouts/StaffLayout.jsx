import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const StaffLayout = () => {
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

export default StaffLayout;