import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import api from "../services/api";
import { useToast } from "../components/ToastProvider";
import { useAuth } from "../context/AuthContext";
import "../styles/Attendance.css";

export default function Attendance() {
  const { user } = useAuth();
  const { show } = useToast();

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = user?.role === "professor" ? "/classes/minhas" : "/classes";
    api.get(url).then((r) => {
      const data = Array.isArray(r.data) ? r.data : r.data?.turmas || [];
      setClasses(data);
    });
  }, []);

  const loadStudentsAndHistory = (turma) => {
    setSelectedClass(turma);
    setRecords({});

    Promise.all([
      api.get("/enrollments/minhas"),
      api.get(`/attendances?class_id=${turma.id}&date=${date}`),
    ]).then(([e, a]) => {
      const matriculas = e.data?.matriculas || e.data || [];
      const alunosDaTurma = (Array.isArray(matriculas) ? matriculas : [])
        .filter((m) => m.class_id === turma.id)
        .map((m) => m.student)
        .filter(Boolean);

      setStudents(alunosDaTurma);
      console.log("alunos:", alunosDaTurma); // adiciona isso

      const recordsMap = {};
      alunosDaTurma.forEach((s) => {
        recordsMap[s.id] = "presente";
      });
      (Array.isArray(a.data) ? a.data : []).forEach((att) => {
        recordsMap[att.student_id] = att.status;
      });
      setRecords(recordsMap);
    });

    api.get(`/attendances?class_id=${turma.id}`).then((r) => {
      setHistory(Array.isArray(r.data) ? r.data : []);
    });
  };

  const save = async () => {
    if (!selectedClass) return;
    setLoading(true);
    try {
      await api.post("/attendances", {
        class_id: selectedClass.id,
        date,
        records: students.map((s) => ({
          student_id: s.id,
          status: records[s.id] ?? "presente",
        })),
      });
      show({
        severity: "success",
        summary: "Salvo",
        detail: "Frequência registrada!",
        life: 3000,
      });
      loadStudentsAndHistory(selectedClass);
    } catch (e) {
      show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao salvar frequência.",
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const statusBody = (row) => (
    <div style={{ display: "flex", gap: 8 }}>
      {["presente", "falta", "justificada"].map((s) => (
        <button
          key={s}
          onClick={() => setRecords((prev) => ({ ...prev, [row.id]: s }))}
          className={`attendance-status-btn ${
            records[row.id] === s
              ? `attendance-status-btn--${s}`
              : "attendance-status-btn--inactive"
          }`}
        >
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </button>
      ))}
    </div>
  );

  const historyStatusBody = (row) => (
    <span className={`attendance-badge attendance-badge--${row.status}`}>
      {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
    </span>
  );

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header__text">
          <h1>Frequência</h1>
          <p>Registre a presença dos alunos por aula</p>
        </div>
      </div>

      <div className="attendance-grid">
        {/* Turmas */}
        <div className="card">
          <div className="card-header">
            <h2>Turmas</h2>
          </div>
          <div className="card-body" style={{ padding: 12 }}>
            {classes.map((c) => (
              <div
                key={c.id}
                onClick={() => loadStudentsAndHistory(c)}
                className={`professor-class-item ${selectedClass?.id === c.id ? "professor-class-item--active" : ""}`}
              >
                {c.name}
              </div>
            ))}
          </div>
        </div>

        <div className="attendance-column">
          {/* Lançar frequência */}
          <div className="card">
            <div className="card-header">
              <h2>
                {selectedClass
                  ? `Frequência — ${selectedClass.name}`
                  : "Frequência"}
              </h2>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  type="date"
                  className="form-input"
                  style={{ width: 160 }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                {selectedClass && (
                  <button
                    className="btn btn-primary"
                    onClick={save}
                    disabled={loading}
                  >
                    {loading ? (
                      <i className="pi pi-spin pi-spinner" />
                    ) : (
                      <i className="pi pi-check" />
                    )}
                    Salvar
                  </button>
                )}
              </div>
            </div>
            <div className="card-body">
              {!selectedClass ? (
                <div className="attendance-empty">
                  <i className="pi pi-arrow-left" />
                  <p>Selecione uma turma</p>
                </div>
              ) : students.length === 0 ? (
                <p style={{ color: "var(--muted)", fontSize: 13 }}>
                  Nenhum aluno matriculado.
                </p>
              ) : (
                <DataTable
                  key={JSON.stringify(records)}
                  value={students}
                  emptyMessage="Nenhum aluno."
                >
                  <Column field="name" header="Aluno" sortable />
                  <Column header="Status" body={statusBody} />
                </DataTable>
              )}
            </div>
          </div>

          {/* Histórico */}
          {selectedClass && history.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2>Histórico de Frequência</h2>
              </div>
              <div className="card-body">
                <DataTable
                  value={history}
                  paginator
                  rows={10}
                  emptyMessage="Sem histórico."
                >
                  <Column
                    header="Aluno"
                    body={(r) => r.student?.name ?? "—"}
                    sortable
                  />
                  <Column
                    header="Data"
                    body={(r) => {
                      const [year, month, day] = r.date.split("-");
                      return `${day}/${month}/${year}`;
                    }}
                    sortable
                  />
                  <Column header="Status" body={historyStatusBody} />
                </DataTable>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
