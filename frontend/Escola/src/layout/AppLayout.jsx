import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useUI } from "../context/UIContext";

export default function AppLayout({ children }) {
  const { dark } = useUI();

  return (
    <div className={dark ? "dark bg-gray-900 text-white" : "bg-gray-100"}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 min-h-screen">
          <Topbar />
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

//tema preto e branco 