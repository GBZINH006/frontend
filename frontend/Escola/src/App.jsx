import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./components/ToastProvider";
import { UIProvider } from "./context/UIContext";

import ScrollToTop from "./components/ScrollToTop";

import Login from "./pages/login";

import Dashboard from "./pages/Dashboard";
import Professordashboard from "./pages/Professordashboard";
import Studentdashboard from "./pages/Studentdashboard";

import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Enrollments from "./pages/Enrollments";
import Grades from "./pages/Grades";

import MyEnrollments from "./pages/Myenrollments";
import MyGrades from "./pages/Mygrades";

import AppLayout from "./layout/AppLayout";

/* 🔐 Proteção de rota */
function PrivateRoute({ children }) {
  const auth = useAuth();
  if (!auth) return null;

  const { isAuthenticated, loading } = auth;

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}

/* 🎯 Redireciona para o dashboard correto por ROLE */
function RoleDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  if (user.role === "admin") return <Dashboard />;
  if (user.role === "professor") return <Professordashboard />;
  if (user.role === "aluno") return <Studentdashboard />;

  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <UIProvider>
          <BrowserRouter>
            <ScrollToTop />

            <Routes>
              {/* Login */}
              <Route path="/login" element={<Login />} />

              {/* App protegido */}
              <Route
                path="/*"
                element={
                  <PrivateRoute>
                    <AppLayout />
                  </PrivateRoute>
                }
              >
                {/* Dashboard por role */}
                <Route index element={<RoleDashboard />} />

                {/* ADMIN */}
                <Route path="students" element={<Students />} />
                <Route path="teachers" element={<Teachers />} />
                <Route path="classes" element={<Classes />} />
                <Route path="enrollments" element={<Enrollments />} />
                <Route path="grades" element={<Grades />} />

                {/* ALUNO */}
                <Route path="my-enrollments" element={<MyEnrollments />} />
                <Route path="my-grades" element={<MyGrades />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </UIProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
