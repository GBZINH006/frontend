import { NavLink } from "react-router-dom";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const NAV_ITEMS = [
  {
    path: "/",
    label: "Dashboard",
    icon: "pi-home",
    roles: ["admin", "professor", "aluno"],
  },
  {
    path: "/students",
    label: "Alunos",
    icon: "pi-users",
    roles: ["admin", "professor"],
  },
  {
    path: "/teachers",
    label: "Professores",
    icon: "pi-briefcase",
    roles: ["admin"],
  },
  {
    path: "/classes",
    label: "Turmas",
    icon: "pi-book",
    roles: ["admin", "professor"],
  },
  {
    path: "/enrollments",
    label: "Matrículas",
    icon: "pi-id-card",
    roles: ["admin", "professor"],
  },
  {
    path: "/grades",
    label: "Notas",
    icon: "pi-star",
    roles: ["admin", "professor"],
  },
  {
    path: "/my-enrollments",
    label: "Minhas Turmas",
    icon: "pi-book",
    roles: ["aluno"],
  },
  {
    path: "/my-grades",
    label: "Minhas Notas",
    icon: "pi-star",
    roles: ["aluno"],
  },
];

const ROLE_LABELS = {
  admin: {
    label: "Administrador",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.15)",
  },
  professor: {
    label: "Professor",
    color: "#10b981",
    bg: "rgba(16,185,129,0.15)",
  },
  aluno: { label: "Aluno", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
};

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUI();
  const { user, logout } = useAuth();

  const visibleItems = NAV_ITEMS.filter((i) => i.roles.includes(user?.role));
  const roleInfo = ROLE_LABELS[user?.role] ?? ROLE_LABELS.aluno;

  return (
    <aside
      className={`sidebar ${sidebarCollapsed ? "sidebar--collapsed" : ""}`}
    >
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo__icon">
          <i className="pi pi-graduation-cap" style={{ color: "#fff" }} />
        </div>
        {!sidebarCollapsed && (
          <span className="sidebar-logo__title">Portal Escolar</span>
        )}
      </div>

      {/* Badge do role */}
      {!sidebarCollapsed && (
        <div className="sidebar-role">
          <span
            className="sidebar-role__badge"
            style={{ background: roleInfo.bg, color: roleInfo.color }}
          >
            {roleInfo.label}
          </span>
        </div>
      )}

      {/* Navegação */}
      <nav className="sidebar-nav">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `sidebar-nav__link ${isActive ? "sidebar-nav__link--active" : ""}`
            }
          >
            <i className={`pi ${item.icon}`} />
            {!sidebarCollapsed && item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {!sidebarCollapsed && user && (
          <div className="sidebar-footer__user">
            <div className="sidebar-footer__name">{user.name}</div>
            <div className="sidebar-footer__email">{user.email}</div>
          </div>
        )}

        <button className="sidebar-footer__btn" onClick={toggleSidebar}>
          <i
            className={`pi ${sidebarCollapsed ? "pi-angle-double-right" : "pi-angle-double-left"}`}
          />
          {!sidebarCollapsed && "Recolher"}
        </button>

        <button
          className="sidebar-footer__btn sidebar-footer__btn--danger"
          onClick={logout}
        >
          <i className="pi pi-sign-out" />
          {!sidebarCollapsed && "Sair"}
        </button>
      </div>
    </aside>
  );
}
