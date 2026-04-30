import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import { ToastProvider } from "./components/ToastProvider";
import AppLayout from "./layout/AppLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Enrollments from "./pages/Enrollments";
import Grades from "./pages/Grades";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

function HomeDashboard() {
  const { user } = useAuth();

  if (user?.role === "aluno") return <StudentDashboard />;
  if (user?.role === "professor") return <ProfessorDashboard />;

  return <Dashboard />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      <Route
        path="/*"
        element={
          <PrivateRoute>
            <AppLayout user={user} />
          </PrivateRoute>
        }
      >
        <Route index element={<HomeDashboard />} />

        <Route path="students" element={<Students />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="classes" element={<Classes />} />
        <Route path="enrollments" element={<Enrollments />} />
        <Route path="grades" element={<Grades />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </UIProvider>
    </AuthProvider>
  );
}