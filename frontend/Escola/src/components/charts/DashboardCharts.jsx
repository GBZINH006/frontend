import { Chart } from "primereact/chart";

export default function DashboardCharts({ studentsData }) {
    const data = {
        labels: studentsData.map((s) => s.month),
        datasets: [
            {
                label: "Alunos",
                data: studentsData.map((s) => s.total),
                fill: false,
                tension: 0.4,
            },
        ],
    };

    return <Chart type="line" data={data} />;
}