import { useAuth } from "../context/AuthContext";
import "./Topbar.css";

const ROLE_LABELS = {
  admin: "Administrador",
  professor: "Professor",
  aluno: "Aluno",
};

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <span className="topbar__title">Portal Escolar</span>

      <div className="topbar__right">
        <div className="topbar__user">
          <div className="topbar__avatar">
            {user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <div className="topbar__name">{user?.name}</div>
            <div className="topbar__role">{ROLE_LABELS[user?.role] ?? ""}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
