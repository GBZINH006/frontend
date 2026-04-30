import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <Outlet /> {/* ESSENCIAL */}
      </div>
    </div>
  );
}