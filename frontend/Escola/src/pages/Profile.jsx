import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";
import api from "../services/api";

const ROLE_LABELS = {
  admin: "Administrador",
  professor: "Professor",
  aluno: "Aluno",
};

export default function Profile() {
  const { user, login } = useAuth();
  const { show } = useToast();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (form.password && form.password !== form.confirmPassword) {
      show({ severity: "warn", summary: "Atenção", detail: "As senhas não coincidem.", life: 3000 });
      return;
    }

    if (form.password && form.password.length < 8) {
      show({ severity: "warn", summary: "Atenção", detail: "A senha deve ter no mínimo 8 caracteres.", life: 3000 });
      return;
    }

    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;

      const { data } = await api.put(`/users/${user?.id}`, payload);
      login(data.token);

      show({ severity: "success", summary: "Atualizado", detail: "Perfil atualizado com sucesso!", life: 3000 });
      setForm({ ...form, password: "", confirmPassword: "" });
    } catch (e) {
      show({ severity: "error", summary: "Erro", detail: e.response?.data?.message || "Erro ao atualizar.", life: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header__text">
          <h1>Meu Perfil</h1>
          <p>Gerencie suas informações pessoais</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, alignItems: "start" }}>

        {/* Card de avatar */}
        <div className="card">
          <div className="card-body" style={{ textAlign: "center", padding: 32 }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
              display: "grid", placeItems: "center",
              fontSize: 32, fontWeight: 700, color: "#0b1120",
              margin: "0 auto 16px",
            }}>
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 6 }}>
              {user?.name}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
              {user?.email}
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700,
              padding: "3px 12px", borderRadius: 999,
              background: "rgba(245,158,11,0.15)", color: "#f59e0b",
            }}>
              {ROLE_LABELS[user?.role] ?? user?.role}
            </span>
          </div>
        </div>

        {/* Formulário */}
        <div className="card">
          <div className="card-header">
            <h2>Editar informações</h2>
          </div>
          <div className="card-body">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Nome</label>
                <input
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input
                  className="form-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="seu@email.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nova senha <span style={{ color: "var(--muted)", fontWeight: 400, textTransform: "none" }}>(deixe vazio para não alterar)</span></label>
                <input
                  className="form-input"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirmar senha</label>
                <input
                  className="form-input"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repita a nova senha"
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <button className="btn btn-primary" onClick={save} disabled={loading}>
                  {loading ? <i className="pi pi-spin pi-spinner" /> : <i className="pi pi-check" />}
                  {loading ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}