import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }) {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <Topbar />
                <div className="p-4">{children}</div>
            </div>
        </div>
    )
}