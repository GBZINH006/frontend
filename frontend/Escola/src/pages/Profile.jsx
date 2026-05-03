import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";
import api from "../services/api";
import "../styles/Profile.css";

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
      show({
        severity: "warn",
        summary: "Atenção",
        detail: "As senhas não coincidem.",
        life: 3000,
      });
      return;
    }

    if (form.password && form.password.length < 8) {
      show({
        severity: "warn",
        summary: "Atenção",
        detail: "A senha deve ter no mínimo 8 caracteres.",
        life: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;

      const { data } = await api.put(`/users/${user?.id}`, payload);
      login(data.token);

      show({
        severity: "success",
        summary: "Atualizado",
        detail: "Perfil atualizado com sucesso!",
        life: 3000,
      });
      setForm({ ...form, password: "", confirmPassword: "" });
    } catch (e) {
      show({
        severity: "error",
        summary: "Erro",
        detail: e.response?.data?.message || "Erro ao atualizar.",
        life: 4000,
      });
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

      <div className="profile-grid">
        <div className="card">
          <div className="card-body profile-avatar-card">
            <div className="profile-avatar">
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="profile-name">{user?.name}</div>
            <div className="profile-email">{user?.email}</div>
            <span className="profile-role-badge">
              {ROLE_LABELS[user?.role] ?? user?.role}
            </span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Editar informações</h2>
          </div>
          <div className="card-body">
            <div className="profile-form">
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
                <label className="form-label">
                  Nova senha{" "}
                  <span
                    style={{
                      color: "var(--muted)",
                      fontWeight: 400,
                      textTransform: "none",
                    }}
                  >
                    (deixe vazio para não alterar)
                  </span>
                </label>
                <input
                  className="form-input"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirmar senha</label>
                <input
                  className="form-input"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  placeholder="Repita a nova senha"
                />
              </div>
              <div className="profile-form-actions">
                <button
                  className="btn btn-primary"
                  onClick={save}
                  disabled={loading}
                >
                  {loading ? (
                    <i className="pi pi-spin pi-spinner" />
                  ) : (
                    <i className="pi pi-check" />
                  )}
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
