import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";

export default function ProfessorDashboard({ user }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("/api/classes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setClasses(Array.isArray(data) ? data : []);
      })
      .catch(() => setClasses([]))
      .finally(() => setLoading(false));
  }, []);

  const loadStudents = (classData) => {
    const token = localStorage.getItem("token");

    setSelectedClass(classData);
    setStudents([]);

    axios
      .get(`/api/enrollments/${classData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setStudents(Array.isArray(data) ? data : []);
      })
      .catch(() => setStudents([]));
  };

  const onGradeChange = (value, studentId) => {
    setGrades({ ...grades, [studentId]: value });
  };

  const saveGrade = (studentId) => {
    const token = localStorage.getItem("token");
    const nota = grades[studentId];

    if (nota == null || nota < 0 || nota > 10) {
      toast.current.show({ severity: "warn", summary: "Nota inválida", detail: "Digite entre 0 e 10" });
      return;
    }

    axios
      .post(
        "/api/grades",
        {
          aluno_id: studentId,
          nota,
          turma_id: selectedClass.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        toast.current.show({ severity: "success", summary: "Salvo", detail: "Nota lançada" });
      })
      .catch(() => {
        toast.current.show({ severity: "error", summary: "Erro", detail: "Falha ao salvar" });
      });
  };

  const gradeBody = (row) => (
    <InputNumber
      value={grades[row.id] || null}
      onValueChange={(e) => onGradeChange(e.value, row.id)}
      min={0}
      max={10}
      style={{ width: 100 }}
    />
  );

  const actionBody = (row) => (
    <Button label="Salvar" size="small" onClick={() => saveGrade(row.id)} />
  );

  return (
    <div style={{ padding: 24 }}>
      <Toast ref={toast} />

      <h2 style={{ marginBottom: 20 }}>
        Professor: <span style={{ color: "#6366f1" }}>{user?.name}</span>
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
        <Card title="Turmas">
          {loading ? (
            <Skeleton height="4rem" />
          ) : classes.length === 0 ? (
            <p>Sem turmas</p>
          ) : (
            (classes || []).map((c) => (
              <div
                key={c.id}
                style={{
                  padding: 12,
                  cursor: "pointer",
                  borderRadius: 6,
                  marginBottom: 8,
                  background: selectedClass?.id === c.id ? "#e0e7ff" : "#f8fafc",
                }}
                onClick={() => loadStudents(c)}
              >
                {c.name || c.nome}
              </div>
            ))
          )}
        </Card>

        <Card title="Alunos">
          {!selectedClass ? (
            <p>Selecione uma turma</p>
          ) : students.length === 0 ? (
            <Skeleton height="4rem" />
          ) : (
            <DataTable value={students} responsiveLayout="scroll">
              <Column field="name" header="Aluno" />
              <Column body={gradeBody} header="Nota" />
              <Column body={actionBody} header="" />
            </DataTable>
          )}
        </Card>
      </div>
    </div>
  );
}
