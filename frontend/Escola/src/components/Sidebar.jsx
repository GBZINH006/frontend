import { NavLink } from "react-router-dom";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";

const NAV_ADMIN = [
  { to: "/",            icon: "pi-home",      label: "Dashboard"   },
  { to: "/students",    icon: "pi-users",     label: "Alunos"      },
  { to: "/teachers",    icon: "pi-briefcase", label: "Professores" },
  { to: "/classes",     icon: "pi-book",      label: "Turmas"      },
  { to: "/enrollments", icon: "pi-id-card",   label: "Matrículas"  },
  { to: "/grades",      icon: "pi-star",      label: "Notas"       },
];

const NAV_ALUNO = [
  { to: "/",                icon: "pi-home",    label: "Início"       },
  { to: "/my-enrollments",  icon: "pi-id-card", label: "Minhas Turmas"},
  { to: "/my-grades",       icon: "pi-star",    label: "Minhas Notas" },
];

const NAV_PROFESSOR = [
  { to: "/",        icon: "pi-home",  label: "Dashboard" },
  { to: "/classes", icon: "pi-book",  label: "Turmas"    },
  { to: "/grades",  icon: "pi-star",  label: "Notas"     },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUI();
  const { user, logout } = useAuth();

  const role = user?.role;
  const nav = role === "aluno" ? NAV_ALUNO : role === "professor" ? NAV_PROFESSOR : NAV_ADMIN;

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            <i className="pi pi-graduation-cap" />
          </div>
          <span className="sidebar__logo-text">EscolaPro</span>
        </div>
        <button className="sidebar__toggle" onClick={toggleSidebar} title="Recolher">
          <i className={`pi ${sidebarCollapsed ? "pi-angle-right" : "pi-angle-left"}`} />
        </button>
      </div>

      <nav className="sidebar__nav">
        {nav.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => isActive ? "active" : ""}>
            <i className={`pi ${icon} nav-icon`} />
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user" onClick={logout} title="Sair">
          <div className="sidebar__avatar">{initials}</div>
          <div className="sidebar__user-info">
            <div className="sidebar__user-name">{user?.name ?? "Usuário"}</div>
            <div className="sidebar__user-role">{role} · Sair</div>
          </div>
        </div>
      </div>
    </aside>
  );
}