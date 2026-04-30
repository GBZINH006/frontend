import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";
import api from "../services/api";

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
      login(data.token); // useEffect cuida do redirect
    } catch (err) {
      show({ severity: "error", summary: "Erro", detail: err.response?.data?.message || "E-mail ou senha incorretos.", life: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>

      {/* ── Lado esquerdo — decorativo ── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px",
        background: "linear-gradient(145deg, #0b1120 0%, #0f2444 60%, #0b1120 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* círculos decorativos */}
        {[
          { w: 500, h: 500, top: -160, left: -160, opacity: 0.07 },
          { w: 350, h: 350, top: -60,  left: -60,  opacity: 0.05 },
          { w: 400, h: 400, bottom: -120, right: -120, opacity: 0.06 },
        ].map((s, i) => (
          <div key={i} style={{
            position: "absolute",
            width: s.w, height: s.h,
            borderRadius: "50%",
            border: "1.5px solid rgba(99,179,237," + s.opacity * 10 + ")",
            top: s.top, left: s.left, bottom: s.bottom, right: s.right,
            pointerEvents: "none",
          }} />
        ))}

        {/* glow âmbar */}
        <div style={{
          position: "absolute",
          width: 360, height: 360,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,158,11,0.12), transparent 70%)",
          top: -80, right: 40,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          width: 280, height: 280,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56,189,248,0.10), transparent 70%)",
          bottom: -60, left: 60,
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", textAlign: "center", color: "#fff", maxWidth: 360 }}>
          {/* ícone */}
          <div style={{
            width: 80, height: 80,
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
            borderRadius: 24,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 28px",
            boxShadow: "0 8px 32px rgba(245,158,11,0.35)",
            fontSize: 36,
          }}>
            🎓
          </div>

          <h1 style={{
            fontSize: 38, fontWeight: 800, lineHeight: 1.15,
            marginBottom: 14,
          }}>
            <span style={{
              background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Portal</span>{" "}
            <span style={{ color: "#fff" }}>Escolar</span>
          </h1>

          <p style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 15, lineHeight: 1.7,
            marginBottom: 40,
          }}>
            Gerencie alunos, professores e turmas em um só lugar.
          </p>

          {/* features */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
            {[
              { icon: "pi-users",    text: "CRUD completo de alunos e turmas" },
              { icon: "pi-id-card",  text: "Controle de matrículas em tempo real" },
              { icon: "pi-star",     text: "Lançamento e histórico de notas" },
              { icon: "pi-lock",     text: "Autenticação JWT com roles" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 32, height: 32,
                  background: "rgba(245,158,11,0.15)",
                  borderRadius: 8,
                  display: "grid", placeItems: "center",
                  flexShrink: 0,
                }}>
                  <i className={`pi ${icon}`} style={{ color: "#f59e0b", fontSize: 14 }} />
                </div>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Lado direito — formulário ── */}
      <div style={{
        width: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 48px",
        background: "#f0f4f8",
      }}>
        <div style={{ width: "100%" }}>

          {/* cabeçalho */}
          <div style={{
            width: 48, height: 48,
            background: "#0b1120",
            borderRadius: 14,
            display: "grid", placeItems: "center",
            marginBottom: 24,
          }}>
            <i className="pi pi-graduation-cap" style={{ color: "#f59e0b", fontSize: 20 }} />
          </div>

          <h2 style={{
            fontSize: 28, fontWeight: 800,
            color: "#0f172a", marginBottom: 6, lineHeight: 1.2,
          }}>
            Bom te ver de volta
          </h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 36 }}>
            Entre com suas credenciais para acessar o painel.
          </p>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* email */}
            <div>
              <label style={{
                fontSize: 12.5, fontWeight: 700,
                color: "#0f172a", display: "block", marginBottom: 7,
                letterSpacing: 0.2,
              }}>
                E-MAIL
              </label>
              <div style={{ position: "relative" }}>
                <i className="pi pi-envelope" style={{
                  position: "absolute", left: 14, top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8", fontSize: 14, pointerEvents: "none",
                }} />
                <input
                  type="email"
                  name="email"
                  placeholder="admin@admin.com"
                  value={form.email}
                  onChange={handle}
                  required
                  autoComplete="email"
                  style={{
                    width: "100%", padding: "12px 14px 12px 40px",
                    background: "#fff",
                    border: "1.5px solid #e2e8f0", borderRadius: 10,
                    fontSize: 14, color: "#0f172a", outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: "border-color .15s, box-shadow .15s",
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = "#f59e0b";
                    e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* senha */}
            <div>
              <label style={{
                fontSize: 12.5, fontWeight: 700,
                color: "#0f172a", display: "block", marginBottom: 7,
                letterSpacing: 0.2,
              }}>
                SENHA
              </label>
              <div style={{ position: "relative" }}>
                <i className="pi pi-lock" style={{
                  position: "absolute", left: 14, top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8", fontSize: 14, pointerEvents: "none",
                }} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handle}
                  required
                  autoComplete="current-password"
                  style={{
                    width: "100%", padding: "12px 14px 12px 40px",
                    background: "#fff",
                    border: "1.5px solid #e2e8f0", borderRadius: 10,
                    fontSize: 14, color: "#0f172a", outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: "border-color .15s, box-shadow .15s",
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = "#f59e0b";
                    e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.12)";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* botão */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                padding: "13px",
                background: loading
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #0b1120, #1e3a5f)",
                color: "#fff",
                border: "none", borderRadius: 10,
                fontSize: 14, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: 0.3,
                transition: "opacity .15s, box-shadow .15s",
                boxShadow: loading ? "none" : "0 4px 16px rgba(11,17,32,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
              onMouseEnter={e => { if (!loading) e.target.style.opacity = "0.88"; }}
              onMouseLeave={e => { e.target.style.opacity = "1"; }}
            >
              {loading && <i className="pi pi-spin pi-spinner" />}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}