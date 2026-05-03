import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import api from "../services/api";
import { useToast } from "../components/ToastProvider";

const empty = { name: "", email: "", password: "" };

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const { show } = useToast();

  const load = () => {
    setLoading(true);
    api
      .get("/classes/professores?limit=1000")
      .then((r) => setTeachers(Array.isArray(r.data) ? r.data : []))
      .catch(() => setTeachers([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setForm(empty);
    setEditing(null);
    setDialog(true);
  };
  const openEdit = (row) => {
    setForm({
      name: row.user?.name ?? row.name ?? "",
      email: row.user?.email ?? row.email ?? "",
      password: "",
    });
    setEditing(row.professor_id ?? row.id);
    setDialog(true);
  };

  const save = async () => {
    if (!form.name || !form.email) {
      show({
        severity: "warn",
        summary: "Atenção",
        detail: "Nome e e-mail são obrigatórios.",
        life: 3000,
      });
      return;
    }
    try {
      if (editing) {
        const payload = { name: form.name, email: form.email };
        if (form.password) payload.password = form.password;
        await api.put(`/professors/${editing}`, payload);
        show({
          severity: "success",
          summary: "Atualizado",
          detail: "Professor atualizado.",
          life: 3000,
        });
      } else {
        if (!form.password) {
          show({
            severity: "warn",
            summary: "Atenção",
            detail: "Informe uma senha.",
            life: 3000,
          });
          return;
        }
        await api.post("/auth/register", { ...form, role: "professor" });
        show({
          severity: "success",
          summary: "Criado",
          detail: "Professor cadastrado.",
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
    const name = row.user?.name ?? row.name;
    confirmDialog({
      message: `Excluir o professor "${name}"?`,
      header: "Confirmar exclusão",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await api.delete(`/professors/${row.professor_id ?? row.id}`);
          show({
            severity: "warn",
            summary: "Excluído",
            detail: "Professor removido.",
            life: 3000,
          });
          load();
        } catch (e) {
          show({
            severity: "error",
            summary: "Erro",
            detail: e.response?.data?.message || "Erro ao excluir.",
            life: 4000,
          });
        }
      },
    });
  };

  const filtered = teachers.filter((t) => {
    const name = (t.user?.name ?? t.name ?? "").toLowerCase();
    const email = (t.user?.email ?? t.email ?? "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  const avatarBody = (row) => {
    const name = row.user?.name ?? row.name ?? "?";
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#10b981,#3b82f6)",
            display: "grid",
            placeItems: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {name[0]?.toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>
            {name}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted2)" }}>
            {row.user?.email ?? row.email ?? "—"}
          </div>
        </div>
      </div>
    );
  };

  const turmasBody = (row) => {
    const turmas = row.classes ?? row.turmas ?? [];
    if (!turmas.length)
      return <span style={{ color: "var(--muted2)" }}>Sem turmas</span>;
    return (
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {turmas.map((t) => (
          <span key={t.id ?? t} className="badge badge-blue">
            {t.name ?? t}
          </span>
        ))}
      </div>
    );
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
        className="btn btn-danger"
        style={{ padding: "6px 12px" }}
        onClick={() => remove(row)}
      >
        <i className="pi pi-trash" />
      </button>
    </div>
  );

  return (
    <div className="animate-in">
      <ConfirmDialog />

      <div className="page-header">
        <div className="page-header__text">
          <h1>Professores</h1>
          <p>
            {teachers.length} professor{teachers.length !== 1 ? "es" : ""}{" "}
            cadastrado{teachers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <i className="pi pi-plus" /> Novo Professor
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Lista de Professores</h2>
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
              placeholder="Buscar professor..."
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
          emptyMessage="Nenhum professor encontrado."
          rowHover
        >
          <Column
            header="Professor"
            body={avatarBody}
            sortable
            sortField="user.name"
          />
          <Column header="Turmas" body={turmasBody} />
          <Column header="Ações" body={actions} style={{ width: 120 }} />
        </DataTable>
      </div>

      <Dialog
        header={editing ? "Editar Professor" : "Novo Professor"}
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
            <label className="form-label">Nome completo</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nome do professor"
            />
          </div>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="professor@escola.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Senha{" "}
              {editing && (
                <span style={{ color: "var(--muted2)", fontWeight: 400 }}>
                  (deixe vazio para não alterar)
                </span>
              )}
            </label>
            <input
              className="form-input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={editing ? "••••••••" : "Mínimo 6 caracteres"}
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
            <button className="btn btn-primary" onClick={save}>
              Salvar
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
