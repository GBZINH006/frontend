import { useEffect, useState } from "react";

export default function Toast({ mensagem, tipo = "erro", onClose }) {
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisivel(false);
      setTimeout(onClose, 300);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const cores = {
    erro: { bg: "#ff4d4d", icon: "✕" },
    sucesso: { bg: "#22c55e", icon: "✓" },
    aviso: { bg: "#f59e0b", icon: "!" },
  };

  return (
    <div style={{
      position: "fixed",
      top: "24px",
      right: "24px",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      gap: "12px",
      background: cores[tipo].bg,
      color: "#fff",
      padding: "14px 20px",
      borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "14px",
      fontWeight: 500,
      minWidth: "280px",
      maxWidth: "380px",
      opacity: visivel ? 1 : 0,
      transform: visivel ? "translateY(0)" : "translateY(-16px)",
      transition: "all 0.3s ease",
    }}>
      <span style={{
        width: "24px", height: "24px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: "13px", flexShrink: 0,
      }}>
        {cores[tipo].icon}
      </span>
      <span style={{ flex: 1 }}>{mensagem}</span>
      <button onClick={() => { setVisivel(false); setTimeout(onClose, 300); }}
        style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "18px", lineHeight: 1, opacity: 0.7 }}>
        ×
      </button>
    </div>
  );
}