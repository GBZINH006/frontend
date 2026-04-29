import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chart } from "primereact/chart";
import api from "../services/api";

export default function Dashboard() {
  const [counts, setCounts] = useState({ students: 0, classes: 0, professors: 0, enrollments: 0 });
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get("/students"),
      api.get("/classes"),
      api.get("/classes/professores"),
      api.get("/enrollments"),
      api.get("/grades"),
    ]).then(([s, c, p, e, g]) => {
      setCounts({
        students: s.data.length,
        classes: c.data.length,
        professors: p.data.length,
        enrollments: e.data.length,
      });
      setGrades(g.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // gráfico de barras — notas por turma (média)
  const classMap = {};
  grades.forEach(({ turma, nota }) => {
    if (!classMap[turma]) classMap[turma] = [];
    classMap[turma].push(nota);
  });
  const barLabels = Object.keys(classMap).slice(0, 6);
  const barData = barLabels.map((t) => {
    const arr = classMap[t];
    return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
  });

  const chartData = {
    labels: barLabels.length ? barLabels : ["Sem dados"],
    datasets: [{
      label: "Média de notas",
      data: barLabels.length ? barData : [0],
      backgroundColor: "rgba(245,158,11,0.18)",
      borderColor: "#f59e0b",
      borderWidth: 2,
      borderRadius: 8,
      tension: 0.4,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 0, max: 10, grid: { color: "#f1f5f9" }, ticks: { font: { family: "Plus Jakarta Sans" } } },
      x: { grid: { display: false }, ticks: { font: { family: "Plus Jakarta Sans" } } },
    },
  };

  const stats = [
    { label: "Alunos",      value: counts.students,    icon: "pi-users",      color: "#3b82f6", accent: "#3b82f6", link: "/students" },
    { label: "Professores", value: counts.professors,   icon: "pi-briefcase",  color: "#10b981", accent: "#10b981", link: "/teachers" },
    { label: "Turmas",      value: counts.classes,      icon: "pi-book",       color: "#f59e0b", accent: "#f59e0b", link: "/classes"  },
    { label: "Matrículas",  value: counts.enrollments,  icon: "pi-id-card",    color: "#8b5cf6", accent: "#8b5cf6", link: "/enrollments" },
  ];

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header__text">
          <h1>Dashboard</h1>
          <p>Visão geral do sistema escolar</p>
        </div>
      </div>

      {/* stats */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div
            key={s.label}
            className="stats-card"
            style={{ "--card-accent": s.accent, cursor: "pointer" }}
            onClick={() => navigate(s.link)}
          >
            <div className="stats-card__top">
              <div className="stats-card__icon" style={{ background: s.color + "18", color: s.color }}>
                <i className={`pi ${s.icon}`} />
              </div>
            </div>
            <div className="stats-card__value">
              {loading ? <i className="pi pi-spin pi-spinner" style={{ fontSize: 24, color: "var(--muted2)" }} /> : s.value}
            </div>
            <div className="stats-card__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* gráfico */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <h2>Média de Notas por Turma</h2>
              <p>Desempenho médio dos alunos</p>
            </div>
          </div>
          <div className="card-body">
            <Chart type="bar" data={chartData} options={chartOptions} style={{ height: 240 }} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2>Resumo Geral</h2>
              <p>Distribuição do sistema</p>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {stats.map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: s.color + "18", color: s.color,
                    display: "grid", placeItems: "center", flexShrink: 0,
                  }}>
                    <i className={`pi ${s.icon}`} style={{ fontSize: 14 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>{s.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{s.value}</span>
                    </div>
                    <div style={{ height: 4, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${Math.min((s.value / Math.max(...stats.map(x => x.value), 1)) * 100, 100)}%`,
                        background: s.color,
                        borderRadius: 4,
                        transition: "width .6s ease",
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}