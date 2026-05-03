import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import api from "../services/api";
import { useToast } from "../components/ToastProvider";
import { useAuth } from "../context/AuthContext";
import { Dialog } from "primereact/dialog";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Grades() {
  const { show } = useToast();
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [turmaFiltro, setTurmaFiltro] = useState(null);
  const [form, setForm] = useState({ value: "" });
  const [historyDialog, setHistoryDialog] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyGrade, setHistoryGrade] = useState(null);

  const openHistory = async (row) => {
    setHistoryGrade(row);
    const { data } = await api.get(`/grades/${row.id}/history`);
    setHistory(Array.isArray(data) ? data : []);
    setHistoryDialog(true);
  };

  const openEdit = (row) => {
    setForm({ value: row.nota });
    setEditing(row.id);
    setDialog(true);
  };

  const save = async () => {
    try {
      await api.put(`/grades/${editing}`, { value: form.value });
      show({
        severity: "success",
        summary: "Atualizado",
        detail: "Nota atualizada.",
        life: 3000,
      });
      setDialog(false);
      load();
    } catch (e) {
      show({
        severity: "error",
        summary: "Erro",
        detail: e.response?.data?.message || "Erro ao salvar.",
        life: 4000,
      });
    }
  };

  const actions = (row) => (
    <div style={{ display: "flex", gap: 6 }}>
      <button
        className="btn btn-ghost"
        style={{ padding: "6px 12px" }}
        onClick={() => openEdit(row)}
      >
        <i className="pi pi-pencil" />
      </button>
      <button
        className="btn btn-ghost"
        style={{ padding: "6px 12px" }}
        onClick={() => openHistory(row)}
      >
        <i className="pi pi-history" />
      </button>
      <button
        className="btn btn-danger"
        style={{ padding: "6px 12px" }}
        onClick={() => remove(row)}
      >
        <i className="pi pi-trash" />
      </button>
    </div>
  );

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

  const filtered = grades.filter((g) => {
    const matchSearch =
      g.aluno?.toLowerCase().includes(search.toLowerCase()) ||
      g.turma?.toLowerCase().includes(search.toLowerCase());
    const matchTurma = turmaFiltro ? g.turma === turmaFiltro : true;
    return matchSearch && matchTurma;
  });

  const turmasUnicas = [...new Set(grades.map((g) => g.turma))].map((t) => ({
    label: t,
    value: t,
  }));

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

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Relatório de Notas", 14, 15);
    doc.setFontSize(10);
    doc.text(`Gerado em ${new Date().toLocaleDateString("pt-BR")}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [["Aluno", "Turma", "Nota", "Situação"]],
      body: filtered.map((g) => [
        g.aluno,
        g.turma,
        g.nota,
        g.nota >= 7 ? "Aprovado" : g.nota >= 5 ? "Recuperação" : "Reprovado",
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [245, 158, 11] },
    });

    doc.save("notas.pdf");
  };

  return (
    <div className="animate-in">
      <ConfirmDialog />
      <div className="page-header">
        <div className="page-header__text">
          <h1>Notas</h1>
          <p>{grades.length} notas lançadas</p>
        </div>
        <button className="btn btn-primary" onClick={exportPDF}>
          <i className="pi pi-file-pdf" /> Exportar PDF
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Lista de Notas</h2>
          <div style={{ display: "flex", gap: 10 }}>
            <select
              className="form-input"
              style={{ width: 200 }}
              value={turmaFiltro ?? ""}
              onChange={(e) => setTurmaFiltro(e.target.value || null)}
            >
              <option value="">Todas as turmas</option>
              {turmasUnicas.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
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
        </div>
        <Dialog
          header="Editar Nota"
          visible={dialog}
          onHide={() => setDialog(false)}
          style={{ width: 360 }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              paddingTop: 8,
            }}
          >
            <div className="form-group">
              <label className="form-label">Nota</label>
              <input
                className="form-input"
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={form.value}
                onChange={(e) => setForm({ value: parseFloat(e.target.value) })}
              />
            </div>
            <div
              style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
            >
              <button
                className="btn btn-ghost"
                onClick={() => setDialog(false)}
              >
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={save}>
                Salvar
              </button>
            </div>
          </div>
        </Dialog>
        <Dialog
          header={`Histórico — ${historyGrade?.aluno} em ${historyGrade?.turma}`}
          visible={historyDialog}
          onHide={() => setHistoryDialog(false)}
          style={{ width: 480 }}
        >
          {history.length === 0 ? (
            <p
              style={{
                color: "var(--muted)",
                textAlign: "center",
                padding: "24px 0",
              }}
            >
              Nenhuma alteração registrada.
            </p>
          ) : (
            <DataTable value={history} emptyMessage="Sem histórico.">
              <Column
                header="Nota anterior"
                body={(r) => (
                  <span style={{ color: "#f87171", fontWeight: 700 }}>
                    {r.old_value}
                  </span>
                )}
              />
              <Column
                header="Nova nota"
                body={(r) => (
                  <span style={{ color: "#4ade80", fontWeight: 700 }}>
                    {r.new_value}
                  </span>
                )}
              />
              <Column
                header="Data"
                body={(r) =>
                  new Date(r.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
              />
            </DataTable>
          )}
        </Dialog>
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
