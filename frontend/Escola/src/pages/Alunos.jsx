import { useEffect, useState } from "react";
import  api  from "../services/api";

export default function Alunos() {
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");

  async function carregar() {
    const res = await api.get("/students");
    setDados(res.data);
  }

  useEffect(() => {
    carregar();
  }, []);

  const filtrados = dados.filter((a) =>
    a.name.toLowerCase().includes(busca.toLowerCase())
  );

  async function excluir(id) {
    await api.delete(`/students/${id}`);
    carregar();
  }

  return (
    <div>
      <h1>Alunos</h1>

      <input
        placeholder="Buscar..."
        onChange={(e) => setBusca(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {filtrados.map((a) => (
            <tr key={a.id}>
              <td>
                <img
                  src={a.avatar || "https://i.pravatar.cc/40"}
                  width={40}
                />
              </td>
              <td>{a.name}</td>
              <td>{a.email}</td>

              <td>
                <button>Editar</button>
                <button onClick={() => excluir(a.id)}>
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}