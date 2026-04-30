import { useEffect, useState } from "react";
import  api  from "../services/api";

export default function Professores() {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    api.get("/teachers").then((res) => setLista(res.data));
  }, []);

  return (
    <div>
      <h1>Professores</h1>

      {lista.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}