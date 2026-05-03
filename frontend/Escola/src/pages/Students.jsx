import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import api from "../services/api";
import { useToast } from "../components/ToastProvider";
import { useAuth } from "../context/AuthContext";

const empty = { name: "", email: "", password: "" };

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const { show } = useToast();
  const { user } = useAuth();

  const load = () => {
    setLoading(true);
    if (user?.role === "professor") {
      api
        .get("/enrollments/minhas")
        .then((r) => {
          const data = r.data?.matriculas || r.data;
          const alunos = (Array.isArray(data) ? data : [])
            .map((e) => e.student)
            .filter(Boolean);
          const unicos = alunos.filter(
            (a, i, arr) => arr.findIndex((x) => x.id === a.id) === i,
          );
          setStudents(unicos);
        })
        .finally(() => setLoading(false));
    } else {
      api
        .get("/students")
        .then((r) => setStudents(r.data?.alunos || r.data))
        .finally(() => setLoading(false));
    }
  };

  useEffect(load, []);

  const openNew = () => {
    setForm(empty);
    setEditing(null);
    setDialog(true);
  };
  const openEdit = (row) => {
    setForm({ name: row.name, email: row.email });
    setEditing(row.id);
    setDialog(true);
  };

  const save = async () => {
    try {
      if (editing) {
        await api.put(`/students/${editing}`, form);
        show({
          severity: "success",
          summary: "Atualizado",
          detail: "Aluno atualizado.",
          life: 3000,
        });
      } else {
        await api.post("/auth/register", { ...form, role: "aluno" });
        show({
          severity: "success",
          summary: "Criado",
          detail: "Aluno cadastrado.",
          life: 3000,
        });
      }
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

  const remove = (row) => {
    confirmDialog({
      message: `Excluir o aluno "${row.name}"?`,
      header: "Confirmar exclusão",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        await api.delete(`/students/${row.id}`);
        show({
          severity: "warn",
          summary: "Excluído",
          detail: "Aluno removido.",
          life: 3000,
        });
        load();
      },
    });
  };

  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()),
  );

  // troca o actions por:
  const actions = (row) => (
    <div style={{ display: "flex", gap: 6 }}>
      {user?.role === "admin" && (
        <>
          <button
            className="btn btn-ghost"
            style={{ padding: "6px 12px" }}
            onClick={() => openEdit(row)}
          >
            <i className="pi pi-pencil" />
          </button>
          <button
            className="btn btn-danger"
            style={{ padding: "6px 12px" }}
            onClick={() => remove(row)}
          >
            <i className="pi pi-trash" />
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="animate-in">
      <ConfirmDialog />
      <div className="page-header">
        <div className="page-header__text">
          <h1>Alunos</h1>
          <p>{students.length} alunos cadastrados</p>
        </div>
        {user?.role === "admin" && (
          <button className="btn btn-primary" onClick={openNew}>
            <i className="pi pi-plus" /> Novo Aluno
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Lista de Alunos</h2>
          <div style={{ display: "flex", gap: 10 }}>
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
                style={{ paddingLeft: 32, width: 220 }}
                placeholder="Buscar por nome ou e-mail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DataTable
          value={filtered}
          loading={loading}
          paginator
          rows={10}
          emptyMessage="Nenhum aluno encontrado."
          rowHover
        >
          <Column field="id" header="ID" sortable style={{ width: 70 }} />
          <Column field="name" header="Nome" sortable />
          <Column field="email" header="E-mail" sortable />
          <Column header="Ações" body={actions} style={{ width: 120 }} />
        </DataTable>
      </div>

      <Dialog
        header={editing ? "Editar Aluno" : "Novo Aluno"}
        visible={dialog}
        onHide={() => setDialog(false)}
        style={{ width: 440 }}
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
            <label className="form-label">Nome</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nome completo"
            />
          </div>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@exemplo.com"
            />
          </div>
          {!editing && (
            <div className="form-group">
              <label className="form-label">Senha</label>
              <input
                className="form-input"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Mínimo 8 caracteres, 1 maiúscula e 1 número"
              />
            </div>
          )}
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
            <button className="btn btn-primary" onClick={save}>
              Salvar
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
