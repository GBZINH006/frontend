import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/enrollments"),
      api.get("/grades"),
    ]).then(([e, g]) => {
      // filtra pelo student_id do user logado (o id vem do JWT como user.id)
      const myEnrollments = e.data.filter(en => en.student?.email === user?.email || true);
      setEnrollments(e.data);
      setGrades(g.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const avg = grades.length
    ? (grades.reduce((a, b) => a + b.nota, 0) / grades.length).toFixed(1)
    : "—";

  const avgColor = avg >= 7 ? "#16a34a" : avg >= 5 ? "#b45309" : avg === "—" ? "var(--muted)" : "#be123c";

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header__text">
          <h1>Olá, {user?.name?.split(" ")[0] ?? "Aluno"} 👋</h1>
          <p>Acompanhe suas turmas e notas</p>
        </div>
      </div>

      {/* cards resumo */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 28 }}>
        <div className="stats-card" style={{ "--card-accent": "#3b82f6", cursor: "pointer" }} onClick={() => navigate("/my-enrollments")}>
          <div className="stats-card__top">
            <div className="stats-card__icon" style={{ background: "#3b82f618", color: "#3b82f6" }}>
              <i className="pi pi-book" />
            </div>
          </div>
          <div className="stats-card__value">{loading ? "…" : enrollments.length}</div>
          <div className="stats-card__label">Turmas matriculadas</div>
        </div>

        <div className="stats-card" style={{ "--card-accent": "#f59e0b", cursor: "pointer" }} onClick={() => navigate("/my-grades")}>
          <div className="stats-card__top">
            <div className="stats-card__icon" style={{ background: "#f59e0b18", color: "#f59e0b" }}>
              <i className="pi pi-star" />
            </div>
          </div>
          <div className="stats-card__value">{loading ? "…" : grades.length}</div>
          <div className="stats-card__label">Notas lançadas</div>
        </div>

        <div className="stats-card" style={{ "--card-accent": avgColor }}>
          <div className="stats-card__top">
            <div className="stats-card__icon" style={{ background: avgColor + "18", color: avgColor }}>
              <i className="pi pi-chart-bar" />
            </div>
          </div>
          <div className="stats-card__value" style={{ color: avgColor }}>{loading ? "…" : avg}</div>
          <div className="stats-card__label">Média geral</div>
        </div>
      </div>

      {/* últimas notas */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2>Últimas Notas</h2>
            <p>Seu desempenho recente</p>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate("/my-grades")}>
            Ver todas <i className="pi pi-arrow-right" style={{ marginLeft: 4 }} />
          </button>
        </div>
        <div className="card-body">
          {loading ? (
            <div style={{ textAlign: "center", padding: 32, color: "var(--muted2)" }}>
              <i className="pi pi-spin pi-spinner" style={{ fontSize: 24 }} />
            </div>
          ) : grades.length === 0 ? (
            <div style={{ textAlign: "center", padding: 32, color: "var(--muted2)" }}>
              <i className="pi pi-inbox" style={{ fontSize: 32, marginBottom: 8, display: "block" }} />
              Nenhuma nota lançada ainda.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {grades.slice(0, 5).map((g) => {
                const c = g.nota >= 7 ? "#16a34a" : g.nota >= 5 ? "#b45309" : "#be123c";
                const bg = g.nota >= 7 ? "#dcfce7" : g.nota >= 5 ? "#fef3c7" : "#ffe4e6";
                return (
                  <div key={g.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", background: "var(--bg)",
                    borderRadius: 10, border: "1px solid var(--border)",
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{g.turma}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{g.aluno}</div>
                    </div>
                    <span style={{
                      width: 44, height: 30, borderRadius: 8,
                      background: bg, color: c,
                      fontWeight: 700, fontSize: 15,
                      display: "grid", placeItems: "center",
                    }}>{g.nota}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}