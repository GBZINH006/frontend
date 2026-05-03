import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import api from "../services/api";
import { useToast } from "../components/ToastProvider";
import { useAuth } from "../context/AuthContext";

const empty = { student_id: null, class_id: null };

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState("");
  const { show } = useToast();
  const { user } = useAuth();

  const load = () => {
    setLoading(true);
    const enrollUrl =
      user?.role === "professor" ? "/enrollments/minhas" : "/enrollments";
    Promise.all([api.get(enrollUrl), api.get("/students"), api.get("/classes")])
      .then(([e, s, c]) => {
        const data = e.data?.matriculas || e.data;
        console.log("enrollments:", data);
        setEnrollments(Array.isArray(data) ? data : []);
        setStudents(
          (s.data?.alunos || s.data).map((s) => ({
            label: s.name,
            value: s.id,
          })),
        );
        setClasses(
          (c.data?.turmas || c.data).map((c) => ({
            label: c.name,
            value: c.id,
          })),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const save = async () => {
    try {
      await api.post("/enrollments", form);
      show({
        severity: "success",
        summary: "Matrícula realizada",
        detail: "Aluno matriculado com sucesso.",
        life: 3000,
      });
      setDialog(false);
      setForm(empty);
      load();
    } catch (e) {
      show({
        severity: "error",
        summary: "Erro",
        detail: e.response?.data?.message || "Erro ao matricular.",
        life: 4000,
      });
    }
  };

  const remove = (row) => {
    confirmDialog({
      message: `Cancelar a matrícula de "${row.student?.name}" em "${row.class?.name}"?`,
      header: "Cancelar Matrícula",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        await api.delete(`/enrollments/${row.id}`);
        show({
          severity: "warn",
          summary: "Matrícula cancelada",
          detail: "Matrícula removida.",
          life: 3000,
        });
        load();
      },
    });
  };

  const filtered = enrollments.filter(
    (e) =>
      e.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.class?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const statusBody = () => <span className="badge badge-green">Ativa</span>;

  const actions = (row) =>
    user?.role === "admin" ? (
      <button
        className="btn btn-danger"
        style={{ padding: "6px 12px" }}
        onClick={() => remove(row)}
      >
        <i className="pi pi-times" /> Cancelar
      </button>
    ) : null;

  return (
    <div className="animate-in">
      <ConfirmDialog />
      <div className="page-header">
        <div className="page-header__text">
          <h1>Matrículas</h1>
          <p>{enrollments.length} matrículas ativas</p>
        </div>
        {user?.role === "admin" && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setForm(empty);
              setDialog(true);
            }}
          >
            <i className="pi pi-plus" /> Nova Matrícula
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Lista de Matrículas</h2>
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
          emptyMessage="Nenhuma matrícula encontrada."
          rowHover
        >
          <Column field="id" header="ID" sortable style={{ width: 70 }} />
          <Column field="student.name" header="Aluno" sortable />
          <Column field="student.email" header="E-mail" />
          <Column field="class.name" header="Turma" sortable />
          <Column header="Status" body={statusBody} style={{ width: 100 }} />
          <Column header="Ações" body={actions} style={{ width: 130 }} />
        </DataTable>
      </div>

      <Dialog
        header="Nova Matrícula"
        visible={dialog}
        onHide={() => setDialog(false)}
        style={{ width: 460 }}
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
            <label className="form-label">Aluno</label>
            <Dropdown
              value={form.student_id}
              options={students}
              onChange={(e) => setForm({ ...form, student_id: e.value })}
              placeholder="Selecione um aluno"
              filter
              style={{ width: "100%" }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Turma</label>
            <Dropdown
              value={form.class_id}
              options={classes}
              onChange={(e) => setForm({ ...form, class_id: e.value })}
              placeholder="Selecione uma turma"
              filter
              style={{ width: "100%" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <button className="btn btn-ghost" onClick={() => setDialog(false)}>
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              onClick={save}
              disabled={!form.student_id || !form.class_id}
            >
              Matricular
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
