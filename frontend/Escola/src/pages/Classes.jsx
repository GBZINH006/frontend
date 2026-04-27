import { useEffect, useState } from "react";
import api from "../services/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function Classes() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    api.get("/classes").then((res) => {
      setClasses(res.data);
    });
  }, []);

  return (
    <DataTable value={classes} paginator rows={5}>
      <Column field="name" header="Turma" />
      <Column field="description" header="Descrição" />
      <Column field="professor.name" header="Professor" />
    </DataTable>
  );
}