import { Card } from "primereact/card";

export default function StatsCard({ title, value, icon}) {
    return (
        <div className="col-12 md:col-4">
            <Card>
                <div className="flex aling-items-center justify-content-between">
                    <div>
                        <h4>{title}</h4>
                        <h2>{value}</h2>
                    </div>
                    <i className={`${icon} text-4x1`}></i>
                </div>
            </Card>
        </div>
    );
}