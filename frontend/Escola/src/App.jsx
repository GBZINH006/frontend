import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/students" element={<Students />}/>
          <Route path="/teachers" element={<Teachers />}/>
          <Route path="/classes" element={<Classes />}/>
        </Routes>
      </AppLayout>
    </Router>
  )
}