import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";
import api from "../services/api";
import "../styles/login.css";

// partículas geradas uma vez
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size:  Math.random() * 4 + 2,
  left:  Math.random() * 100,
  bottom: Math.random() * 40,
  duration: Math.random() * 8 + 6,
  delay:    Math.random() * 6,
  drift:    (Math.random() - 0.5) * 60,
  color: i % 3 === 0
    ? "rgba(245,158,11,0.7)"
    : i % 3 === 1
    ? "rgba(99,179,237,0.6)"
    : "rgba(255,255,255,0.4)",
}));

const CIRCLES = [
  { w: 500, h: 500, top: -160, left: -160 },
  { w: 350, h: 350, top: -60,  left: -60  },
  { w: 400, h: 400, bottom: -120, right: -120 },
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
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const leftRef = useRef(null);

  const { login, isAuthenticated } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleMouseMove = (e) => {
    const rect = leftRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width)  * 100,
      y: ((e.clientY - rect.top)  / rect.height) * 100,
    });
  };

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
      <div className="login-left" ref={leftRef} onMouseMove={handleMouseMove}>

        {/* 1. luz que segue o mouse */}
        <div className="login-mouse-glow" style={{ left: `${mouse.x}%`, top: `${mouse.y}%` }} />

        {/* 2. partículas flutuantes */}
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="login-particle"
            style={{
              width: p.size, height: p.size,
              left: `${p.left}%`,
              bottom: `${p.bottom}%`,
              background: p.color,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--drift": `${p.drift}px`,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
          />
        ))}

        {CIRCLES.map((s, i) => (
          <div key={i} className="login-circle" style={{
            width: s.w, height: s.h,
            top: s.top, left: s.left,
            bottom: s.bottom, right: s.right,
          }} />
        ))}

        <div className="login-glow-amber" />
        <div className="login-glow-blue" />

        {/* 3 + 4. conteúdo com cascata de entrada e ícone com ping */}
        <div className="login-left-content">

          <div className="login-icon-wrapper">
            <div className="login-icon-ping" />
            <div className="login-icon-ping2" />
            <div className="login-icon">🎓</div>
          </div>

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

      {/* ── Lado direito com borda brilhante (5) ── */}
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
                {/* 6. input com borda que acende */}
                <input
                  className="login-input"
                  type="email"
                  name="email"
                  placeholder="seu@email.com"
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

            {/* shimmer no botão (6) */}
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