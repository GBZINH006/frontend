import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function MyGrades() {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // rota específica do aluno: GET /grades/student/:student_id
    api.get(`/grades/student/${user?.id}`)
      .then((r) => setGrades(Array.isArray(r.data) ? r.data : []))
      .catch(() => setGrades([]))
      .finally(() => setLoading(false));
  }, []);

  const avg = grades.length
    ? (grades.reduce((a, b) => a + (b.value ?? b.nota ?? 0), 0) / grades.length).toFixed(1)
    : null;

  const notaBody = (row) => {
    const n = row.value ?? row.nota;
    const color = n >= 7 ? "#16a34a" : n >= 5 ? "#b45309" : "#be123c";
    const bg    = n >= 7 ? "#dcfce7" : n >= 5 ? "#fef3c7" : "#ffe4e6";
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 44, height: 28, borderRadius: 8,
        background: bg, color, fontWeight: 700, fontSize: 13,
      }}>
        {n}
      </span>
    );
  };

  const situacaoBody = (row) => {
    const n = row.value ?? row.nota;
    if (n >= 7) return <span className="badge badge-green">Aprovado</span>;
    if (n >= 5) return <span className="badge badge-amber">Recuperação</span>;
    return <span className="badge badge-rose">Reprovado</span>;
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header__text">
          <h1>Minhas Notas</h1>
          <p>Seu histórico de avaliações</p>
        </div>
      </div>

      {/* resumo */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 24 }}>
        <div className="stats-card" style={{ "--card-accent": "#3b82f6" }}>
          <div className="stats-card__top">
            <div className="stats-card__icon" style={{ background: "#3b82f618", color: "#3b82f6" }}>
              <i className="pi pi-star" />
            </div>
          </div>
          <div className="stats-card__value">{loading ? "…" : grades.length}</div>
          <div className="stats-card__label">Total de notas</div>
        </div>

        <div className="stats-card" style={{ "--card-accent": avg >= 7 ? "#16a34a" : avg >= 5 ? "#b45309" : "#be123c" }}>
          <div className="stats-card__top">
            <div className="stats-card__icon" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
              <i className="pi pi-chart-bar" />
            </div>
          </div>
          <div className="stats-card__value" style={{ color: avg >= 7 ? "#16a34a" : avg >= 5 ? "#b45309" : avg ? "#be123c" : "var(--muted)" }}>
            {loading ? "…" : avg ?? "—"}
          </div>
          <div className="stats-card__label">Média geral</div>
        </div>

        <div className="stats-card" style={{ "--card-accent": "#10b981" }}>
          <div className="stats-card__top">
            <div className="stats-card__icon" style={{ background: "#10b98118", color: "#10b981" }}>
              <i className="pi pi-check-circle" />
            </div>
          </div>
          <div className="stats-card__value">{loading ? "…" : grades.filter(g => (g.value ?? g.nota) >= 7).length}</div>
          <div className="stats-card__label">Aprovações</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Histórico de Notas</h2>
        </div>
        <DataTable
          value={grades}
          loading={loading}
          paginator rows={10}
          emptyMessage="Nenhuma nota lançada ainda."
          rowHover
        >
          <Column header="Turma"    field="class.name"  body={(r) => r.class?.name ?? r.turma ?? "—"} sortable />
          <Column header="Nota"     field="value"       body={notaBody} style={{ width: 90 }} sortable />
          <Column header="Situação" body={situacaoBody} style={{ width: 140 }} />
        </DataTable>
      </div>
    </div>
  );
}