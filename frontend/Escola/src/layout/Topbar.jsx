import { Button } from "primereact/button";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <div
      className="flex justify-content-between align-items-center p-3 shadow-2"
      style={{ background: "#fff", position: "sticky", top: 0, zIndex: 10 }}
    >
      <h3>Dashboard</h3>

      <div className="flex align-items-center gap-3">
        {/* Nome do usuário logado */}
        <span style={{ fontWeight: 600 }}>
          👤 {user?.name || "Usuário"}
        </span>

        <Button
          label="Sair"
          icon="pi pi-sign-out"
          severity="danger"
          onClick={logout}
        />
      </div>
    </div>
  );
}
