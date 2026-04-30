import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import { ToastProvider } from "./components/ToastProvider";
import AppLayout from "./layout/AppLayout";

import Login            from "./pages/login";
import Dashboard        from "./pages/Dashboard";
import StudentDashboard from "./pages/Studentdashboard";
import Students         from "./pages/Students";
import Classes          from "./pages/Classes";
import Enrollments      from "./pages/Enrollments";
import Grades           from "./pages/Grades";
import Teachers         from "./pages/Teachers";
import MyGrades         from "./pages/Mygrades";
import MyEnrollments    from "./pages/Myenrollments";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// ─── Rota pública: redireciona pro dashboard se já estiver logado ─────────────
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

// ─── Rota por role: redireciona pro dashboard se o role não tiver permissão ───
// roles = array de roles permitidos, ex: ["admin", "professor"]
function RoleRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

// ─── Dashboard dinâmico baseado no role ──────────────────────────────────────
function HomeDashboard() {
  const { user } = useAuth();
  return user?.role === "aluno" ? <StudentDashboard /> : <Dashboard />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      {/* Rotas protegidas */}
      <Route path="/*" element={
        <PrivateRoute>
          <AppLayout>
            <Routes>
              {/* Todos os roles autenticados */}
              <Route path="/" element={<HomeDashboard />} />

              {/* Só admin e professor */}
              <Route path="/students" element={
                <RoleRoute roles={["admin", "professor"]}>
                  <Students />
                </RoleRoute>
              } />
              <Route path="/teachers" element={
                <RoleRoute roles={["admin"]}>
                  <Teachers />
                </RoleRoute>
              } />
              <Route path="/classes" element={
                <RoleRoute roles={["admin", "professor"]}>
                  <Classes />
                </RoleRoute>
              } />
              <Route path="/enrollments" element={
                <RoleRoute roles={["admin", "professor"]}>
                  <Enrollments />
                </RoleRoute>
              } />
              <Route path="/grades" element={
                <RoleRoute roles={["admin", "professor"]}>
                  <Grades />
                </RoleRoute>
              } />

              {/* Só aluno */}
              <Route path="/my-enrollments" element={
                <RoleRoute roles={["aluno"]}>
                  <MyEnrollments />
                </RoleRoute>
              } />
              <Route path="/my-grades" element={
                <RoleRoute roles={["aluno"]}>
                  <MyGrades />
                </RoleRoute>
              } />

              {/* Qualquer rota não mapeada volta pro dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <ToastProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </UIProvider>
    </AuthProvider>
  );
}