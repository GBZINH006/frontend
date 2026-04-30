import { NavLink } from "react-router-dom";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";

// Itens de navegação por role
const NAV_ITEMS = [
  { path: "/",               label: "Dashboard",     icon: "pi-home",      roles: ["admin", "professor", "aluno"] },
  { path: "/students",       label: "Alunos",        icon: "pi-users",     roles: ["admin", "professor"] },
  { path: "/teachers",       label: "Professores",   icon: "pi-briefcase", roles: ["admin"] },
  { path: "/classes",        label: "Turmas",        icon: "pi-book",      roles: ["admin", "professor"] },
  { path: "/enrollments",    label: "Matrículas",    icon: "pi-id-card",   roles: ["admin", "professor"] },
  { path: "/grades",         label: "Notas",         icon: "pi-star",      roles: ["admin", "professor"] },
  { path: "/my-enrollments", label: "Minhas Turmas", icon: "pi-book",      roles: ["aluno"] },
  { path: "/my-grades",      label: "Minhas Notas",  icon: "pi-star",      roles: ["aluno"] },
];

const ROLE_LABELS = {
  admin:     { label: "Administrador", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  professor: { label: "Professor",     color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  aluno:     { label: "Aluno",          color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
};

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUI();
  const { user, logout } = useAuth();

  const visibleItems = NAV_ITEMS.filter(i => i.roles.includes(user?.role));
  const roleInfo = ROLE_LABELS[user?.role] ?? ROLE_LABELS.aluno;

  return (
    <aside
      style={{
        width: sidebarCollapsed ? 68 : 240,
        background: "#0f172a",
        display: "flex",
        flexDirection: "column",
        transition: "width .25s ease",
        flexShrink: 0,
        overflow: "hidden",       // ❗ SEM scroll aqui
      }}
    >
      {/* Logo */}
      <div style={{
        padding: "18px 14px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderBottom: "1px solid #1e293b",
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <i className="pi pi-graduation-cap" style={{ color: "#fff" }} />
        </div>
        {!sidebarCollapsed && (
          <strong style={{ color: "#fff" }}>Portal Escolar</strong>
        )}
      </div>

      {/* Badge do role */}
      {!sidebarCollapsed && (
        <div style={{ padding: "10px 14px" }}>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 999,
            background: roleInfo.bg,
            color: roleInfo.color,
          }}>
            {roleInfo.label}
          </span>
        </div>
      )}

      {/* Navegação */}
      <nav style={{ flex: 1, padding: 8 }}>
        {visibleItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 10,
              marginBottom: 4,
              textDecoration: "none",
              color: isActive ? "#fff" : "#94a3b8",
              background: isActive ? "#f59e0b" : "transparent",
              fontWeight: isActive ? 600 : 400,
              transition: "all .15s",
            })}
          >
            <i className={`pi ${item.icon}`} />
            {!sidebarCollapsed && item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: 12, borderTop: "1px solid #1e293b" }}>
        {!sidebarCollapsed && user && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ color: "#f1f5f9", fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>{user.email}</div>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          style={footerBtn}
        >
          <i className={`pi ${sidebarCollapsed ? "pi-angle-double-right" : "pi-angle-double-left"}`} />
          {!sidebarCollapsed && "Recolher"}
        </button>

        <button
          onClick={logout}
          style={{ ...footerBtn, color: "#ef4444" }}
        >
          <i className="pi pi-sign-out" />
          {!sidebarCollapsed && "Sair"}
        </button>
      </div>
    </aside>
  );
}

const footerBtn = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  width: "100%",
  padding: "9px 12px",
  borderRadius: 10,
  border: "none",
  background: "transparent",
  color: "#64748b",
  cursor: "pointer",
  marginBottom: 4,
};
``