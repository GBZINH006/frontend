import { useEffect, useState } from "react";
import api from "../services/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    api.get("/classes/professores").then((res) => {
      setTeachers(res.data);
    });
  }, []);

  return (
    <DataTable value={teachers} paginator rows={5}>
      <Column field="name" header="Nome" />
      <Column field="email" header="Email" />
    </DataTable>
  );
}