import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/ToastProvider";
import api from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [carregando, setCarregando] = useState(false);

  const mostrarToast = (mensagem, tipo = "erro") => {
    show({
      severity: tipo === "sucesso" ? "success" : "error",
      summary: tipo === "sucesso" ? "Sucesso" : "Erro",
      detail: mensagem,
      life: 3000,
    });
  };

  const validar = () => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      mostrarToast("Informe um e-mail válido.");
      return false;
    }
    if (form.senha.length < 6) {
      mostrarToast("A senha deve ter no mínimo 6 caracteres.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔥 handleSubmit chamado", form);
    if (!validar()) return;

    setCarregando(true);
    try {
      console.log("📡 Chamando API...");
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.senha,
      });
      console.log("✅ Resposta completa:", res.data); // ← veja o que vem aqui

      const { token } = res.data;

      const user = JSON.parse(atob(token.split(".")[1])); // extrai do token
      console.log("user:", user); // { id: 2, role: "admin" }

      if (user.role !== "professor" && user.role !== "aluno") {
        mostrarToast("Acesso não permitido para este usuário.");
        return;
      }

      mostrarToast("Login realizado com sucesso!", "sucesso");
      setTimeout(() => {
        login(user, token);
        navigate("/");
      }, 1000);

    } catch (err) { // ← faltava o "err" aqui
      console.log("❌ Erro:", err.response?.data); // ← mostra o erro real do backend
      mostrarToast("E-mail ou senha incorretos.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "#0f172a",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Lado esquerdo — decorativo */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px",
        background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", width: "400px", height: "400px",
          borderRadius: "50%", border: "1px solid rgba(99,179,237,0.15)",
          top: "-100px", left: "-100px",
        }} />
        <div style={{
          position: "absolute", width: "300px", height: "300px",
          borderRadius: "solid rgba(99,179,237,0.1)",
          bottom: "40px", right: "-80px",
        }} />
        <div style={{ position: "relative", textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎓</div>
          <h1 style={{
            fontSize: "36px", fontWeight: 700,
            background: "linear-gradient(90deg, #63b3ed, #90cdf4)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: "12px",
          }}>
            Portal Escolar
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", maxWidth: "280px", lineHeight: 1.6 }}>
            Gerencie alunos, professores e turmas em um só lugar.
          </p>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div style={{
        width: "480px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px",
        background: "#fff",
      }}>
        <div style={{ width: "100%" }}>
          <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>
            Bem-vindo de volta
          </h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "36px" }}>
            Acesse sua conta para continuar
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{
                  width: "100%", padding: "12px 16px",
                  border: "1.5px solid #e2e8f0", borderRadius: "10px",
                  fontSize: "14px", color: "#0f172a", outline: "none",
                  boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
                }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                Senha
              </label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.senha}
                maxLength={20}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                style={{
                  width: "100%", padding: "12px 16px",
                  border: "1.5px solid #e2e8f0", borderRadius: "10px",
                  fontSize: "14px", color: "#0f172a", outline: "none",
                  boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
                }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              style={{
                marginTop: "8px", padding: "13px",
                background: carregando ? "#93c5fd" : "#1d4ed8",
                color: "#fff", border: "none", borderRadius: "10px",
                fontSize: "15px", fontWeight: 600,
                cursor: carregando ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p style={{ marginTop: "24px", fontSize: "12px", color: "#94a3b8", textAlign: "center" }}>
            Acesso exclusivo para professores e alunos
          </p>
        </div>
      </div>
    </div>
  );
}