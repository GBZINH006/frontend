import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import api from "../services/api";

export default function MyEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/enrollments/aluno")
      .then((r) => setEnrollments(Array.isArray(r.data) ? r.data : []))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  const professorBody = (row) => row.class?.professor?.name ?? "—";

  const statusBody = () => <span className="badge badge-green">Ativa</span>;

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header__text">
          <h1>Minhas Turmas</h1>
          <p>
            {enrollments.length} matrícula{enrollments.length !== 1 ? "s" : ""}{" "}
            ativa{enrollments.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Turmas Matriculadas</h2>
        </div>
        <DataTable
          value={enrollments}
          loading={loading}
          paginator
          rows={10}
          emptyMessage="Você não está matriculado em nenhuma turma."
          rowHover
        >
          <Column
            header="Turma"
            field="class.name"
            body={(r) => r.class?.name ?? "—"}
            sortable
          />
          <Column
            header="Descrição"
            field="class.description"
            body={(r) => r.class?.description ?? "—"}
          />
          <Column header="Professor" body={professorBody} />
          <Column header="Status" body={statusBody} style={{ width: 100 }} />
        </DataTable>
      </div>
    </div>
  );
}
