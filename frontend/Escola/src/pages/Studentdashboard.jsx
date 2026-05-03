import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/enrollments/aluno"),
      api.get(`/grades/student/${user?.id}`),
    ])
      .then(([e, g]) => {
        setEnrollments(Array.isArray(e.data) ? e.data : []);
        setGrades(Array.isArray(g.data) ? g.data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const avg = grades.length
    ? (grades.reduce((a, b) => a + (b.value ?? 0), 0) / grades.length).toFixed(
        1,
      )
    : null;

  const notaBody = (row) => {
    const n = row.value ?? row.nota;
    const color = n >= 7 ? "#4ade80" : n >= 5 ? "#fbbf24" : "#f87171";
    const bg =
      n >= 7
        ? "rgba(74,222,128,0.15)"
        : n >= 5
          ? "rgba(251,191,36,0.15)"
          : "rgba(248,113,113,0.15)";
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 28,
          borderRadius: 8,
          background: bg,
          color,
          fontWeight: 700,
          fontSize: 13,
        }}
      >
        {n}
      </span>
    );
  };

  const situacaoBody = (row) => {
    const n = row.value ?? row.nota;
    if (n >= 7)
      return (
        <span style={{ color: "#16a34a", fontWeight: 600 }}>✓ Aprovado</span>
      );
    if (n >= 5)
      return (
        <span style={{ color: "#b45309", fontWeight: 600 }}>⚠ Recuperação</span>
      );
    return (
      <span style={{ color: "#be123c", fontWeight: 600 }}>✗ Reprovado</span>
    );
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header__text">
          <h1>Olá, {user?.name}!</h1>
          <p>Acompanhe suas turmas e notas</p>
        </div>
      </div>

      {/* Stats */}
      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        <div className="stats-card">
          <div className="stats-card__top">
            <div
              className="stats-card__icon"
              style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6" }}
            >
              <i className="pi pi-book" />
            </div>
          </div>
          <div className="stats-card__value">
            {loading ? "…" : enrollments.length}
          </div>
          <div className="stats-card__label">Turmas matriculado</div>
        </div>

        <div className="stats-card">
          <div className="stats-card__top">
            <div
              className="stats-card__icon"
              style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}
            >
              <i className="pi pi-star" />
            </div>
          </div>
          <div className="stats-card__value">
            {loading ? "…" : grades.length}
          </div>
          <div className="stats-card__label">Notas lançadas</div>
        </div>

        <div className="stats-card">
          <div className="stats-card__top">
            <div
              className="stats-card__icon"
              style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}
            >
              <i className="pi pi-chart-bar" />
            </div>
          </div>
          <div
            className="stats-card__value"
            style={{
              color:
                avg >= 7
                  ? "#10b981"
                  : avg >= 5
                    ? "#f59e0b"
                    : avg
                      ? "#ef4444"
                      : "var(--muted)",
            }}
          >
            {loading ? "…" : (avg ?? "—")}
          </div>
          <div className="stats-card__label">Média geral</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Turmas */}
        <div className="card">
          <div className="card-header">
            <h2>Minhas Turmas</h2>
          </div>
          <div className="card-body">
            {loading ? (
              <Skeleton height="4rem" />
            ) : enrollments.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "var(--muted)",
                }}
              >
                <i
                  className="pi pi-book"
                  style={{ fontSize: 24, marginBottom: 10, display: "block" }}
                />
                <p style={{ fontSize: 13 }}>
                  Você não está matriculado em nenhuma turma
                </p>
              </div>
            ) : (
              <DataTable
                value={enrollments}
                emptyMessage="Nenhuma turma."
                rowHover
              >
                <Column header="Turma" body={(r) => r.class?.name ?? "—"} />
                <Column
                  header="Descrição"
                  body={(r) =>
                    r.class?.description ?? (
                      <span style={{ color: "var(--muted)" }}>—</span>
                    )
                  }
                />
              </DataTable>
            )}
          </div>
        </div>

        {/* Notas */}
        <div className="card">
          <div className="card-header">
            <h2>Minhas Notas</h2>
          </div>
          <div className="card-body">
            {loading ? (
              <Skeleton height="4rem" />
            ) : grades.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "var(--muted)",
                }}
              >
                <i
                  className="pi pi-star"
                  style={{ fontSize: 24, marginBottom: 10, display: "block" }}
                />
                <p style={{ fontSize: 13 }}>Nenhuma nota lançada ainda</p>
              </div>
            ) : (
              <DataTable value={grades} emptyMessage="Nenhuma nota." rowHover>
                <Column
                  header="Turma"
                  body={(r) => r.class?.name ?? r.turma ?? "—"}
                />
                <Column header="Nota" body={notaBody} style={{ width: 90 }} />
                <Column
                  header="Situação"
                  body={situacaoBody}
                  style={{ width: 130 }}
                />
              </DataTable>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
