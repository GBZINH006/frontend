import { useEffect, useState } from "react";
import api from "../services/api";
import StatsCard from "../components/ui/StatsCard";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    api.get("/students").then((res) => setStudents(res.data));
    api.get("/classes").then((res) => setClasses(res.data));
    api.get("/classes/professores").then((res) => setTeachers(res.data));
  }, []);

  return (
    <div className="grid">
      <StatsCard title="Alunos" value={students.length} icon="pi pi-users" />
      <StatsCard title="Professores" value={teachers.length} icon="pi pi-briefcase" />
      <StatsCard title="Turmas" value={classes.length} icon="pi pi-book" />
    </div>
  );
}