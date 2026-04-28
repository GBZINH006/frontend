import { NavLink } from "react-router-dom";
import { useUI } from "../context/UIContext";

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUI();

  return (
    <div
      className={`h-screen bg-gray-900 text-white transition-all ${
        sidebarCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-3 flex justify-content-between align-items-center">
        {!sidebarCollapsed && <h2>🎓 Escola</h2>}
        <button onClick={toggleSidebar}>☰</button>
      </div>

      <nav className="flex flex-column gap-2 p-2">
        <NavLink to="/">🏠 {!sidebarCollapsed && "Dashboard"}</NavLink>
        <NavLink to="/students">👨‍🎓 {!sidebarCollapsed && "Alunos"}</NavLink>
        <NavLink to="/teachers">👨‍🏫 {!sidebarCollapsed && "Professores"}</NavLink>
        <NavLink to="/classes">🏫 {!sidebarCollapsed && "Turmas"}</NavLink>
      </nav>
    </div>
  );
}



//catalago de opç