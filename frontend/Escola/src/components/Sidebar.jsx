import { NavLink } from "react-router-dom";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";

// Cada item tem: path, label, icon, roles que podem ver
const NAV_ITEMS = [
  { path: "/",               label: "Dashboard",       icon: "pi-home",          roles: ["admin", "professor", "aluno"] },
  { path: "/students",       label: "Alunos",          icon: "pi-users",         roles: ["admin", "professor"] },
  { path: "/teachers",       label: "Professores",     icon: "pi-briefcase",     roles: ["admin"] },
  { path: "/classes",        label: "Turmas",          icon: "pi-book",          roles: ["admin", "professor"] },
  { path: "/enrollments",    label: "Matrículas",      icon: "pi-id-card",       roles: ["admin", "professor"] },
  { path: "/grades",         label: "Notas",           icon: "pi-star",          roles: ["admin", "professor"] },
  { path: "/my-enrollments", label: "Minhas Turmas",   icon: "pi-book",          roles: ["aluno"] },
  { path: "/my-grades",      label: "Minhas Notas",    icon: "pi-star",          roles: ["aluno"] },
];

const ROLE_LABELS = {
  admin:     { label: "Administrador", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  professor: { label: "Professor",     color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  aluno:     { label: "Aluno",         color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
};

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUI();
  const { user, logout } = useAuth();

  // Filtra os itens de navegação pelo role do usuário logado
  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(user?.role));
  const roleInfo = ROLE_LABELS[user?.role] ?? ROLE_LABELS.aluno;

  return (
    <aside style={{
      width: sidebarCollapsed ? 68 : 240,
      minHeight: "100vh",
      background: "#0f172a",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      transition: "width 0.25s ease",
      overflow: "hidden",
      position: "sticky",
      top: 0,
      height: "100vh",
    }}>

      {/* ── Logo ── */}
      <div style={{
        padding: "18px 14px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderBottom: "1px solid #1e293b",
      }}>
        <div style={{
          width: 36, height: 36,
          background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
          borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
        }}>
          <i className="pi pi-graduation-cap" style={{ color: "#fff", fontSize: 16 }} />
        </div>
        {!sidebarCollapsed && (
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800, fontSize: 15,
            color: "#fff", whiteSpace: "nowrap",
          }}>
            Portal Escolar
          </span>
        )}
      </div>

      {/* ── Badge do role ── */}
      {!sidebarCollapsed && (
        <div style={{ padding: "10px 14px" }}>
          <span style={{
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 700,
            background: roleInfo.bg,
            color: roleInfo.color,
            letterSpacing: 0.3,
          }}>
            {roleInfo.label}
          </span>
        </div>
      )}

      {/* ── Navegação ── */}
      <nav style={{ flex: 1, padding: "8px 8px" }}>
        {visibleItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            title={sidebarCollapsed ? item.label : ""}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 10,
              marginBottom: 2,
              textDecoration: "none",
              fontWeight: isActive ? 600 : 400,
              fontSize: 14,
              color: isActive ? "#fff" : "#94a3b8",
              background: isActive ? "#f59e0b" : "transparent",
              boxShadow: isActive ? "0 4px 12px rgba(245,158,11,0.3)" : "none",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
              overflow: "hidden",
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.style.background.includes("f59e0b")) {
                e.currentTarget.style.background = "#1e293b";
                e.currentTarget.style.color = "#e2e8f0";
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.style.background.includes("f59e0b")) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#94a3b8";
              }
            }}
          >
            <i className={`pi ${item.icon}`} style={{ fontSize: 16, flexShrink: 0 }} />
            {!sidebarCollapsed && item.label}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer: usuário + botão recolher ── */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid #1e293b" }}>
        {!sidebarCollapsed && user && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 12px", marginBottom: 4,
          }}>
            {/* Avatar com iniciais */}
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: roleInfo.bg,
              border: `2px solid ${roleInfo.color}44`,
              display: "grid", placeItems: "center",
              flexShrink: 0,
              fontSize: 12, fontWeight: 700, color: roleInfo.color,
            }}>
              {user.name?.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{
                fontSize: 13, fontWeight: 600, color: "#f1f5f9",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {user.name}
              </div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{user.email}</div>
            </div>
          </div>
        )}

        {/* Botão recolher */}
        <button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            width: "100%", padding: "9px 12px",
            borderRadius: 10, border: "none",
            background: "transparent", color: "#64748b",
            cursor: "pointer", fontSize: 14, whiteSpace: "nowrap",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#1e293b"; e.currentTarget.style.color = "#e2e8f0"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
        >
          <i className={`pi ${sidebarCollapsed ? "pi-angle-double-right" : "pi-angle-double-left"}`} style={{ fontSize: 16, flexShrink: 0 }} />
          {!sidebarCollapsed && "Recolher"}
        </button>

        {/* Botão sair */}
        <button
          onClick={logout}
          title="Sair"
          style={{
            display: "flex", alignItems: "center", gap: 12,
            width: "100%", padding: "9px 12px",
            borderRadius: 10, border: "none",
            background: "transparent", color: "#64748b",
            cursor: "pointer", fontSize: 14, whiteSpace: "nowrap",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#ef4444"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
        >
          <i className="pi pi-sign-out" style={{ fontSize: 16, flexShrink: 0 }} />
          {!sidebarCollapsed && "Sair"}
        </button>
      </div>
    </aside>
  );
}