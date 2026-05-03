import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chart } from "primereact/chart";
import api from "../services/api";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    students: 0,
    classes: 0,
    professors: 0,
    enrollments: 0,
  });
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const safe = (promise) => promise.catch(() => ({ data: {} }));
    Promise.all([
      safe(api.get("/students")),
      safe(api.get("/classes")),
      safe(api.get("/classes/professores")),
      safe(api.get("/enrollments")),
      safe(api.get("/grades")),
    ])
      .then(([s, c, p, e, g]) => {
        setCounts({
          students:
            s.data?.total ??
            (Array.isArray(s.data?.alunos) ? s.data.alunos.length : 0),
          classes:
            c.data?.total ??
            (Array.isArray(c.data?.turmas) ? c.data.turmas.length : 0),
          professors: Array.isArray(p.data) ? p.data.length : 0,
          enrollments:
            e.data?.total ??
            (Array.isArray(e.data?.matriculas) ? e.data.matriculas.length : 0),
        });
        const gradesData = g.data?.notas || g.data;
        setGrades(Array.isArray(gradesData) ? gradesData : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const classMap = {};
  grades.forEach(({ turma, nota }) => {
    if (!turma) return;
    if (!classMap[turma]) classMap[turma] = [];
    classMap[turma].push(nota); // ← nota, não value
  });

  const barLabels = Object.keys(classMap).slice(0, 6);
  const barData = barLabels.map((t) => {
    const arr = classMap[t];
    return +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
  });

  const chartData = {
    labels: barLabels.length ? barLabels : ["Sem dados"],
    datasets: [
      {
        label: "Média",
        data: barLabels.length ? barData : [0],
        backgroundColor: "rgba(245,158,11,0.18)",
        borderColor: "#f59e0b",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        min: 0,
        max: 10,
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "#94a3b8", font: { family: "DM Sans", size: 12 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8", font: { family: "DM Sans", size: 12 } },
      },
    },
  };

  const stats = [
    {
      label: "Alunos",
      value: counts.students,
      icon: "pi-users",
      color: "#3b82f6",
      link: "/students",
    },
    {
      label: "Professores",
      value: counts.professors,
      icon: "pi-briefcase",
      color: "#10b981",
      link: "/teachers",
    },
    {
      label: "Turmas",
      value: counts.classes,
      icon: "pi-book",
      color: "#f59e0b",
      link: "/classes",
    },
    {
      label: "Matrículas",
      value: counts.enrollments,
      icon: "pi-id-card",
      color: "#8b5cf6",
      link: "/enrollments",
    },
  ];

  const maxVal = Math.max(...stats.map((s) => s.value), 1);

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header__text">
          <h1>Dashboard</h1>
          <p>Visão geral do sistema escolar</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s) => (
          <div
            key={s.label}
            className="stats-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(s.link)}
          >
            <div className="stats-card__top">
              <div
                className="stats-card__icon"
                style={{ background: s.color + "18", color: s.color }}
              >
                <i className={`pi ${s.icon}`} />
              </div>
            </div>
            <div className="stats-card__value">
              {loading ? (
                <i
                  className="pi pi-spin pi-spinner"
                  style={{ fontSize: 22, color: "var(--muted2)" }}
                />
              ) : (
                s.value
              )}
            </div>
            <div className="stats-card__label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-charts">
        <div className="card">
          <div className="card-header">
            <div>
              <h2>Média de Notas por Turma</h2>
              <p>Desempenho médio dos alunos</p>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="dashboard-chart-loading">
                <i className="pi pi-spin pi-spinner" style={{ fontSize: 28 }} />
              </div>
            ) : (
              <Chart
                type="bar"
                data={chartData}
                options={chartOptions}
                style={{ height: 240 }}
              />
            )}
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
            <div className="dashboard-resumo">
              {stats.map((s) => (
                <div key={s.label} className="dashboard-resumo__item">
                  <div
                    className="dashboard-resumo__icon"
                    style={{ background: s.color + "18", color: s.color }}
                  >
                    <i className={`pi ${s.icon}`} />
                  </div>
                  <div className="dashboard-resumo__info">
                    <div className="dashboard-resumo__top">
                      <span className="dashboard-resumo__label">{s.label}</span>
                      <span className="dashboard-resumo__value">{s.value}</span>
                    </div>
                    <div className="dashboard-resumo__bar">
                      <div
                        className="dashboard-resumo__bar-fill"
                        style={{
                          width: `${(s.value / maxVal) * 100}%`,
                          background: s.color,
                        }}
                      />
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
