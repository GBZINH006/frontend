import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import "./Topbar.css";

const ROLE_LABELS = {
  admin: "Administrador",
  professor: "Professor",
  aluno: "Aluno",
};

export default function Topbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;

  const loadNotifications = () => {
    api.get("/notifications")
      .then((r) => setNotifications(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});
  };

  useEffect(() => {
    loadNotifications();
    // atualiza a cada 30 segundos
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = async () => {
    await api.put("/notifications/read");
    loadNotifications();
  };

  const markOneRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    loadNotifications();
  };

  return (
    <header className="topbar">
      <span className="topbar__title">Portal Escolar</span>

      <div className="topbar__right">

        {/* Sino de notificações */}
        <div className="topbar__notifications" ref={dropdownRef}>
          <button
            className="topbar__bell"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <i className="pi pi-bell" />
            {unread > 0 && (
              <span className="topbar__badge">{unread}</span>
            )}
          </button>

          {showDropdown && (
            <div className="topbar__dropdown">
              <div className="topbar__dropdown-header">
                <span>Notificações</span>
                {unread > 0 && (
                  <button className="topbar__mark-read" onClick={markAllRead}>
                    Marcar todas como lidas
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div className="topbar__dropdown-empty">
                  <i className="pi pi-bell-slash" />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className="topbar__dropdown-list">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`topbar__notification-item ${!n.read ? "topbar__notification-item--unread" : ""}`}
                      onClick={() => markOneRead(n.id)}
                    >
                      <div className="topbar__notification-icon">
                        <i className="pi pi-star" style={{ color: "#f59e0b", fontSize: 12 }} />
                      </div>
                      <div className="topbar__notification-content">
                        <p>{n.message}</p>
                        <span>{new Date(n.createdAt).toLocaleDateString("pt-BR")}</span>
                      </div>
                      {!n.read && <div className="topbar__notification-dot" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="topbar__user" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
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