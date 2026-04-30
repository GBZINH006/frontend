import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export default function ProfessorDashboard({ user }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    axios.get("/api/classes").then((res) => {
      setClasses(res.data || []);
    });
  }, []);

  const loadStudents = (classId) => {
    axios.get(`/api/enrollments/${classId}`).then((res) => {
      setStudents(res.data || []);
      setSelectedClass(classId);
    });
  };

  const handleGradeChange = (studentId, value) => {
    setGrades({ ...grades, [studentId]: value });
  };

  const submitGrade = (studentId) => {
    axios.post("/api/grades", {
      aluno_id: studentId,
      nota: grades[studentId],
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Área do Professor</h2>

      <div style={{ display: "flex", gap: 20 }}>
        
        <div style={{ width: "30%" }}>
          <Card title="Turmas">
            {classes.map((c) => (
              <div
                key={c.id}
                style={{ padding: 10, cursor: "pointer" }}
                onClick={() => loadStudents(c.id)}
              >
                {c.name}
              </div>
            ))}
          </Card>
        </div>

        <div style={{ width: "70%" }}>
          <Card title="Alunos">
            {!selectedClass ? (
              <p>Selecione uma turma</p>
            ) : (
              students.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <span>{s.name}</span>

                  <InputText
                    placeholder="Nota"
                    onChange={(e) =>
                      handleGradeChange(s.id, e.target.value)
                    }
                  />

                  <Button
                    label="Salvar"
                    onClick={() => submitGrade(s.id)}
                  />
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}