import { Button } from "primereact/button";

export default function Topbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex justify-content-between align-items-center p-3 shadow-2 bg-white">
      <h3>Dashboard</h3>

      <div className="flex align-items-center gap-2">
        <span>👤 Usuário</span>
        <Button
          label="Sair"
          icon="pi pi-sign-out"
          severity="danger"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}


//carinha do usuario