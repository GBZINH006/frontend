import { useEffect, useState, useCallback, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { Skeleton } from "primereact/skeleton";
import api from "../services/api";
import { useToast } from "../components/ToastProvider";
import { useAuth } from "../context/AuthContext";
import "../styles/ProfessorDashboard.css";

export default function ProfessorDashboard() {
  const { user } = useAuth();
  const { show } = useToast();
  const gradesRef = useRef({});
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    api
      .get("/classes/minhas")
      .then((r) => {
        const data = r.data?.turmas || r.data;
        setClasses(Array.isArray(data) ? data : []);
      })
      .catch(() =>
        show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao carregar turmas.",
          life: 3000,
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  const loadStudents = (turma) => {
    setSelectedClass(turma);
    setStudents([]);
    setLoadingStudents(true);

    api
      .get(`/enrollments/class/${turma.id}`)
      .then((r) => {
        setStudents(r.data);
      })
      .catch((err) => {
        console.log("STATUS REAL:", err.response?.status);
        console.log("ERRO COMPLETO:", err);
        console.log("RESPOSTA:", err.response?.data);

        show({
          severity: "error",
          summary: "Erro",
          detail: err.response?.data?.message || "Erro ao carregar alunos.",
          life: 3000,
        });
      })
      .finally(() => setLoadingStudents(false));
  };

  const saveGrade = async (studentId) => {
    const value = gradesRef.current[studentId];

    if (value === null || value === undefined) {
      show({
        severity: "warn",
        summary: "Nota inválida",
        detail: "Digite uma nota antes de salvar.",
        life: 3000,
      });
      return;
    }

    if (value < 0 || value > 10) {
      show({
        severity: "warn",
        summary: "Nota inválida",
        detail: "A nota deve ser entre 0 e 10.",
        life: 3000,
      });
      return;
    }

    try {
      await api.post("/grades", {
        student_id: studentId,
        class_id: selectedClass.id,
        value,
      });
      console.log("Resposta:", await api.get("/grades"));
      // atualiza localmente
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, grade: value } : s)),
      );
      show({
        severity: "success",
        summary: "Salvo",
        detail: "Nota lançada com sucesso!",
        life: 3000,
      });
    } catch (e) {
      show({
        severity: "error",
        summary: "Erro",
        detail: e.response?.data?.message || "Erro ao lançar nota.",
        life: 4000,
      });
    }
  };

  const actionBody = (row) => (
    <button
      className="btn btn-primary"
      style={{ padding: "6px 14px" }}
      onClick={() => saveGrade(row.id)}
    >
      <i className="pi pi-check" /> Salvar
    </button>
  );

  const updateGrade = (studentId, val) => {
    gradesRef.current = { ...gradesRef.current, [studentId]: val };
    setGrades({ ...gradesRef.current });
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header__text">
          <h1>Olá, {user?.name}!</h1>
          <p>Selecione uma turma para lançar notas</p>
        </div>
      </div>

      <div className="professor-grid">
        <div className="card">
          <div className="card-header">
            <h2>Minhas Turmas</h2>
          </div>
          <div className="card-body" style={{ padding: "12px" }}>
            {loading ? (
              <Skeleton height="4rem" />
            ) : classes.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: 13 }}>
                Nenhuma turma encontrada.
              </p>
            ) : (
              classes.map((c) => (
                <div
                  key={c.id}
                  onClick={() => loadStudents(c)}
                  className={`professor-class-item ${selectedClass?.id === c.id ? "professor-class-item--active" : ""}`}
                >
                  {c.name}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>
              {selectedClass ? `Alunos — ${selectedClass.name}` : "Alunos"}
            </h2>
          </div>
          <div className="card-body">
            {!selectedClass ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "var(--muted)",
                }}
              >
                <i
                  className="pi pi-arrow-left"
                  style={{ fontSize: 24, marginBottom: 10, display: "block" }}
                />
                <p style={{ fontSize: 13 }}>
                  Selecione uma turma para ver os alunos
                </p>
              </div>
            ) : loadingStudents ? (
              <Skeleton height="4rem" />
            ) : students.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "var(--muted)",
                }}
              >
                <i
                  className="pi pi-users"
                  style={{ fontSize: 24, marginBottom: 10, display: "block" }}
                />
                <p style={{ fontSize: 13 }}>
                  Nenhum aluno matriculado nessa turma
                </p>
              </div>
            ) : (
              <DataTable
                key={selectedClass?.id}
                value={students}
                responsiveLayout="scroll"
                emptyMessage="Nenhum aluno."
              >
                <Column field="name" header="Aluno" sortable />
                <Column field="email" header="E-mail" />
                <Column
                  header="Nota"
                  style={{ width: 140 }}
                  body={(row) => (
                    <InputNumber
                      value={grades[row.id] ?? row.grade ?? null}
                      onValueChange={(e) => updateGrade(row.id, e.value)}
                      min={0}
                      max={10}
                      mode="decimal"
                      minFractionDigits={1}
                      maxFractionDigits={1}
                    />
                  )}
                />
                <Column header="Nota atual" body={(row) => row.grade ?? "-"} />
                <Column header="" body={actionBody} style={{ width: 120 }} />
              </DataTable>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
