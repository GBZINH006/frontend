import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import api from "../services/api";
import { useToast } from "../components/ToastProvider";

export default function Grades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { show } = useToast();

  const load = () => {
    setLoading(true);
    api
      .get("/grades")
      .then((r) => setGrades(r.data?.notas || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = (row) => {
    confirmDialog({
      message: `Excluir a nota de "${row.aluno}" na turma "${row.turma}"?`,
      header: "Confirmar exclusão",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        await api.delete(`/grades/${row.id}`);
        show({
          severity: "warn",
          summary: "Excluído",
          detail: "Nota removida.",
          life: 3000,
        });
        load();
      },
    });
  };

  const filtered = grades.filter(
    (g) =>
      g.aluno?.toLowerCase().includes(search.toLowerCase()) ||
      g.turma?.toLowerCase().includes(search.toLowerCase()),
  );

  const notaBody = (row) => {
    const n = row.nota;
    const color = n >= 7 ? "#16a34a" : n >= 5 ? "#b45309" : "#be123c";
    const bg =
      n >= 7
        ? "rgba(22,163,74,0.12)"
        : n >= 5
          ? "rgba(180,83,9,0.12)"
          : "rgba(190,18,60,0.12)";
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
    const n = row.nota;
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

  const actions = (row) => (
    <button
      className="btn btn-danger"
      style={{ padding: "6px 12px" }}
      onClick={() => remove(row)}
    >
      <i className="pi pi-trash" />
    </button>
  );

  return (
    <div className="animate-in">
      <ConfirmDialog />
      <div className="page-header">
        <div className="page-header__text">
          <h1>Notas</h1>
          <p>{grades.length} notas lançadas</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Lista de Notas</h2>
          <div style={{ position: "relative" }}>
            <i
              className="pi pi-search"
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--muted2)",
                fontSize: 13,
              }}
            />
            <input
              className="form-input"
              style={{ paddingLeft: 32, width: 240 }}
              placeholder="Buscar aluno ou turma..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <DataTable
          value={filtered}
          loading={loading}
          paginator
          rows={10}
          emptyMessage="Nenhuma nota encontrada."
          rowHover
        >
          <Column field="aluno" header="Aluno" sortable />
          <Column field="turma" header="Turma" sortable />
          <Column header="Nota" body={notaBody} style={{ width: 90 }} />
          <Column
            header="Situação"
            body={situacaoBody}
            style={{ width: 150 }}
          />
          <Column header="Ações" body={actions} style={{ width: 90 }} />
        </DataTable>
      </div>
    </div>
  );
}
