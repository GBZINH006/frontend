import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Topbar.css";

const ROLE_LABELS = {
  admin: "Administrador",
  professor: "Professor",
  aluno: "Aluno",
};

export default function Topbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <span className="topbar__title">Portal Escolar</span>

      <div className="topbar__right">
        <div
          className="topbar__user"
          onClick={() => navigate("/profile")}
          style={{ cursor: "pointer" }}
        >
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