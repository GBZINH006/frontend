import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";
import api from "../services/api";
import "../styles/login.css";

const CIRCLES = [
  { w: 500, h: 500, top: -160, left: -160, opacity: 0.07 },
  { w: 350, h: 350, top: -60,  left: -60,  opacity: 0.05 },
  { w: 400, h: 400, bottom: -120, right: -120, opacity: 0.06 },
];

const FEATURES = [
  { icon: "pi-users",   text: "CRUD completo de alunos e turmas" },
  { icon: "pi-id-card", text: "Controle de matrículas em tempo real" },
  { icon: "pi-star",    text: "Lançamento e histórico de notas" },
  { icon: "pi-lock",    text: "Autenticação JWT com roles" },
];

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      show({ severity: "error", summary: "Erro", detail: "Informe um e-mail válido.", life: 3000 });
      return;
    }
    if (form.password.length < 6) {
      show({ severity: "error", summary: "Erro", detail: "A senha deve ter no mínimo 6 caracteres.", life: 3000 });
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.token);
    } catch (err) {
      show({ severity: "error", summary: "Erro", detail: err.response?.data?.message || "E-mail ou senha incorretos.", life: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ── Lado esquerdo ── */}
      <div className="login-left">
        {CIRCLES.map((s, i) => (
          <div key={i} className="login-circle" style={{
            width: s.w, height: s.h,
            top: s.top, left: s.left,
            bottom: s.bottom, right: s.right,
            opacity: s.opacity,
          }} />
        ))}
        <div className="login-glow-amber" />
        <div className="login-glow-blue" />

        <div className="login-left-content">
          <div className="login-icon">🎓</div>

          <h1 className="login-title">
            <span className="login-title-gradient">Portal</span>{" "}
            <span>Escolar</span>
          </h1>

          <p className="login-subtitle">
            Gerencie alunos, professores e turmas em um só lugar.
          </p>

          <div className="login-features">
            {FEATURES.map(({ icon, text }) => (
              <div key={text} className="login-feature-item">
                <div className="login-feature-icon">
                  <i className={`pi ${icon}`} style={{ color: "#f59e0b", fontSize: 14 }} />
                </div>
                <span className="login-feature-text">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Lado direito ── */}
      <div className="login-right">
        <div className="login-form-wrapper">

          <div className="login-form-icon">
            <i className="pi pi-graduation-cap" style={{ color: "#f59e0b", fontSize: 20 }} />
          </div>

          <h2 className="login-form-title">Bom te ver de volta</h2>
          <p className="login-form-description">
            Entre com suas credenciais para acessar o painel.
          </p>

          <form className="login-form" onSubmit={submit}>
            <div>
              <label className="login-label">E-MAIL</label>
              <div className="login-input-wrapper">
                <i className="pi pi-envelope login-input-icon" />
                <input
                  className="login-input"
                  type="email"
                  name="email"
                  placeholder="admin@admin.com"
                  value={form.email}
                  onChange={handle}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="login-label">SENHA</label>
              <div className="login-input-wrapper">
                <i className="pi pi-lock login-input-icon" />
                <input
                  className="login-input"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handle}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading && <i className="pi pi-spin pi-spinner" />}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}