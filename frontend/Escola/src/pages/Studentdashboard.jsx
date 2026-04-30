import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";

export default function ProfessorDashboard({ user }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("/api/classes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setClasses(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadStudents = (classId) => {
    const token = localStorage.getItem("token");

    setSelectedClass(classId);
    setStudents([]);

    axios
      .get(`/api/enrollments/${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setStudents(data);
      });
  };

  const handleChange = (id, value) => {
    setGrades({ ...grades, [id]: value });
  };

  const saveGrade = (studentId) => {
    const token = localStorage.getItem("token");

    axios.post(
      "/api/grades",
      {
        aluno_id: studentId,
        nota: grades[studentId],
        turma_id: selectedClass,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>
        Professor: <span style={{ color: "#6366f1" }}>{user?.name}</span>
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>
        <Card title="Turmas">
          {loading ? (
            <Skeleton height="4rem" />
          ) : classes.length === 0 ? (
            <p>Sem turmas</p>
          ) : (
            classes.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: 12,
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
                onClick={() => loadStudents(c.id)}
              >
                {c.name}
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
            students.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: 10,
                  borderBottom: "1px solid #eee",
                }}
              >
                <div style={{ flex: 1 }}>{s.name}</div>

                <InputText
                  placeholder="Nota"
                  value={grades[s.id] || ""}
                  onChange={(e) => handleChange(s.id, e.target.value)}
                  style={{ width: 80 }}
                />

                <Button
                  label="Salvar"
                  onClick={() => saveGrade(s.id)}
                />
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
