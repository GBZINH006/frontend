import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import api from "../services/api";
import { useToast } from "../components/ToastProvider";

const empty = { student_id: null, class_id: null, value: null };

export default function Grades() {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const { show } = useToast();

  const load = () => {
    setLoading(true);
    Promise.all([api.get("/grades"), api.get("/students"), api.get("/classes")])
      .then(([g, s, c]) => {
        setGrades(g.data);
        setStudents(s.data.map((s) => ({ label: s.name, value: s.id })));
        setClasses(c.data.map((c) => ({ label: c.name, value: c.id })));
      }).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setForm(empty); setEditing(null); setDialog(true); };
  const openEdit = (row) => { setForm({ student_id: null, class_id: null, value: row.nota }); setEditing(row.id); setDialog(true); };

  const save = async () => {
    try {
      if (editing) {
        await api.put(`/grades/${editing}`, { value: form.value });
        show({ severity: "success", summary: "Nota atualizada", detail: "Nota atualizada com sucesso.", life: 3000 });
      } else {
        await api.post("/grades", { student_id: form.student_id, class_id: form.class_id, value: form.value });
        show({ severity: "success", summary: "Nota lançada", detail: "Nota registrada com sucesso.", life: 3000 });
      }
      setDialog(false);
      load();
    } catch (e) {
      show({ severity: "error", summary: "Erro", detail: e.response?.data?.message || "Erro ao salvar.", life: 4000 });
    }
  };

  const remove = (row) => {
    confirmDialog({
      message: `Excluir a nota de "${row.aluno}" na turma "${row.turma}"?`,
      header: "Confirmar exclusão",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        await api.delete(`/grades/${row.id}`);
        show({ severity: "warn", summary: "Excluída", detail: "Nota removida.", life: 3000 });
        load();
      },
    });
  };

  const filtered = grades.filter((g) =>
    g.aluno?.toLowerCase().includes(search.toLowerCase()) ||
    g.turma?.toLowerCase().includes(search.toLowerCase())
  );

  const notaBody = (row) => {
    const n = row.nota;
    const color = n >= 7 ? "#16a34a" : n >= 5 ? "#b45309" : "#be123c";
    const bg    = n >= 7 ? "#dcfce7" : n >= 5 ? "#fef3c7" : "#ffe4e6";
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 42, height: 28, borderRadius: 8,
        background: bg, color, fontWeight: 700, fontSize: 13,
      }}>
        {n}
      </span>
    );
  };

  const actions = (row) => (
    <div style={{ display: "flex", gap: 6 }}>
      <button className="btn btn-ghost" style={{ padding: "6px 12px" }} onClick={() => openEdit(row)}>
        <i className="pi pi-pencil" />
      </button>
      <button className="btn btn-danger" style={{ padding: "6px 12px" }} onClick={() => remove(row)}>
        <i className="pi pi-trash" />
      </button>
    </div>
  );

  return (
    <div className="animate-in">
      <ConfirmDialog />
      <div className="page-header">
        <div className="page-header__text">
          <h1>Notas</h1>
          <p>{grades.length} notas lançadas</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <i className="pi pi-plus" /> Lançar Nota
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Histórico de Notas</h2>
          <div style={{ position: "relative" }}>
            <i className="pi pi-search" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted2)", fontSize: 13 }} />
            <input
              className="form-input"
              style={{ paddingLeft: 32, width: 240 }}
              placeholder="Buscar aluno ou turma..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <DataTable value={filtered} loading={loading} paginator rows={10} emptyMessage="Nenhuma nota encontrada." rowHover>
          <Column field="id"    header="ID"    sortable style={{ width: 70 }} />
          <Column field="aluno" header="Aluno" sortable />
          <Column field="turma" header="Turma" sortable />
          <Column field="nota"  header="Nota"  sortable body={notaBody} style={{ width: 100 }} />
          <Column header="Ações" body={actions} style={{ width: 120 }} />
        </DataTable>
      </div>

      <Dialog header={editing ? "Editar Nota" : "Lançar Nota"} visible={dialog} onHide={() => setDialog(false)} style={{ width: 440 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
          {!editing && (
            <>
              <div className="form-group">
                <label className="form-label">Aluno</label>
                <Dropdown value={form.student_id} options={students} onChange={(e) => setForm({ ...form, student_id: e.value })} placeholder="Selecione um aluno" filter style={{ width: "100%" }} />
              </div>
              <div className="form-group">
                <label className="form-label">Turma</label>
                <Dropdown value={form.class_id} options={classes} onChange={(e) => setForm({ ...form, class_id: e.value })} placeholder="Selecione uma turma" filter style={{ width: "100%" }} />
              </div>
            </>
          )}
          <div className="form-group">
            <label className="form-label">Nota (0 – 10)</label>
            <InputNumber
              value={form.value}
              onValueChange={(e) => setForm({ ...form, value: e.value })}
              min={0} max={10} minFractionDigits={1} maxFractionDigits={1}
              style={{ width: "100%" }}
              inputStyle={{ width: "100%" }}
              placeholder="Ex: 8.5"
            />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn btn-ghost" onClick={() => setDialog(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={save} disabled={form.value === null}>
              Salvar
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}