import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UIProvider } from "./context/UIContext";
import AppLayout from "./layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";

export default function App() {
  return (
    <UIProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/classes" element={<Classes />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </UIProvider>
  );
}