import { useEffect, useState } from "react";
import  api  from "../services/api";

export default function TurmasAdmin() {
  const [turmas, setTurmas] = useState([]);

  useEffect(() => {
    api.get("/classes").then((res) => setTurmas(res.data));
  }, []);

  return (
    <div>
      <h1>Turmas</h1>

      {turmas.map((t) => (
        <div key={t.id}>{t.name}</div>
      ))}
    </div>
  );
}