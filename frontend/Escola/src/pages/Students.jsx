import { useEffect, useState } from "react";
import api from "../services/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get("/students").then((res) => {
      setStudents(res.data);
    });
  }, []);

  return (
    <DataTable value={students} paginator rows={5}>
      <Column field="name" header="Nome" />
      <Column field="email" header="Email" />
    </DataTable>
  );
}