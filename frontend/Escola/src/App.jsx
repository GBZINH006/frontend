import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UIProvider } from "./context/UIContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./components/ToastProvider";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <UIProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <AppLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="students" element={<Students />} />
                <Route path="teachers" element={<Teachers />} />
                <Route path="classes" element={<Classes />} />
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </UIProvider>
      </ToastProvider>
    </AuthProvider>
  );
}