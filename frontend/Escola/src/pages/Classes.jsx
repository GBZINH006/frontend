import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import api from "../services/api";
import { useToast } from "../components/ToastProvider";
import { useAuth } from "../context/AuthContext";

const empty = { name: "", description: "", professor_id: null };

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const { show } = useToast();
  const { user } = useAuth();

  const load = () => {
    setLoading(true);
    const url =
      user?.role === "professor"
        ? "/classes/minhas?limit=1000"
        : "/classes?limit=1000";

    if (user?.role === "professor") {
      api
        .get(url)
        .then((r) => {
          const data = Array.isArray(r.data) ? r.data : r.data?.turmas || [];
          setClasses(data);
        })
        .finally(() => setLoading(false));
    } else {
      Promise.all([
        api.get(url),
        api.get("/classes/professores?limit=1000"),
        api.get("/enrollments?limit=1000"),
      ])
        .then(([c, p, e]) => {
          const turmas = Array.isArray(c.data?.turmas) ? c.data.turmas : c.data;
          const matriculas = e.data?.matriculas || e.data || [];

          const turmasComContador = (Array.isArray(turmas) ? turmas : []).map(
            (turma) => ({
              ...turma,
              totalAlunos: (Array.isArray(matriculas) ? matriculas : []).filter(
                (m) => m.class_id === turma.id,
              ).length,
            }),
          );

          setClasses(turmasComContador);
          setProfessors(
            p.data.map((prof) => ({
              label: prof.user.name,
              value: prof.professor_id,
            })),
          );
        })
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
    setForm({
      name: row.name,
      description: row.description || "",
      professor_id: null,
    });
    setEditing(row.id);
    setDialog(true);
  };

  const save = async () => {
    try {
      if (editing) {
        await api.put(`/classes/${editing}`, {
          name: form.name,
          description: form.description,
        });
      } else {
        await api.post("/classes", form);
      }
      show({
        severity: "success",
        summary: editing ? "Atualizado" : "Criado",
        detail: `Turma ${editing ? "atualizada" : "criada"} com sucesso.`,
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

  const remove = (row) => {
    confirmDialog({
      message: `Excluir a turma "${row.name}"?`,
      header: "Confirmar exclusão",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        await api.delete(`/classes/${row.id}`);
        show({
          severity: "warn",
          summary: "Excluída",
          detail: "Turma removida.",
          life: 3000,
        });
        load();
      },
    });
  };

  const filtered = classes.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.professor?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const professorBody = (row) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#10b981,#3b82f6)",
          display: "grid",
          placeItems: "center",
          fontSize: 11,
          fontWeight: 700,
          color: "#fff",
          flexShrink: 0,
        }}
      >
        {row.professor?.name?.[0]?.toUpperCase() ?? "?"}
      </div>
      {row.professor?.name ?? "—"}
    </div>
  );

  const actions = (row) =>
    user?.role === "admin" ? (
      <div style={{ display: "flex", gap: 6 }}>
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
      </div>
    ) : null;

  return (
    <div className="animate-in">
      <ConfirmDialog />
      <div className="page-header">
        <div className="page-header__text">
          <h1>Turmas</h1>
          <p>{classes.length} turmas cadastradas</p>
        </div>
        {user?.role === "admin" && (
          <button className="btn btn-primary" onClick={openNew}>
            <i className="pi pi-plus" /> Nova Turma
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Lista de Turmas</h2>
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
              placeholder="Buscar turma ou professor..."
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
          emptyMessage="Nenhuma turma encontrada."
          rowHover
        >
          <Column field="id" header="ID" sortable style={{ width: 70 }} />
          <Column field="name" header="Turma" sortable />
          <Column
            field="description"
            header="Descrição"
            body={(r) =>
              r.description || <span style={{ color: "var(--muted2)" }}>—</span>
            }
          />
          {user?.role === "admin" && (
            <Column
              header="Alunos"
              body={(r) => (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(59,130,246,0.15)",
                    color: "#3b82f6",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {r.totalAlunos ?? 0}
                </span>
              )}
              style={{ width: 90 }}
            />
          )}
          {user?.role === "admin" && (
            <Column
              header="Professor"
              body={professorBody}
              sortable
              sortField="professor.name"
            />
          )}
          {user?.role === "admin" && (
            <Column header="Ações" body={actions} style={{ width: 120 }} />
          )}
        </DataTable>
      </div>

      <Dialog
        header={editing ? "Editar Turma" : "Nova Turma"}
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
            <label className="form-label">Nome da Turma</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Turma A - 2025"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Descrição</label>
            <input
              className="form-input"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Descrição opcional"
            />
          </div>
          {!editing && (
            <div className="form-group">
              <label className="form-label">Professor</label>
              <Dropdown
                value={form.professor_id}
                options={professors}
                onChange={(e) => setForm({ ...form, professor_id: e.value })}
                placeholder="Selecione um professor"
                style={{ width: "100%" }}
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
