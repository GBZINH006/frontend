import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
<<<<<<< HEAD

=======
>>>>>>> e559ba33e1095ab034618e9bc48b844179846677
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

<<<<<<< HEAD
function RoleRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

=======
function HomeDashboard() {
  const { user } = useAuth();
>>>>>>> e559ba33e1095ab034618e9bc48b844179846677


function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

<<<<<<< HEAD
      <Route path="/*" element={
        <PrivateRoute>
          <AppLayout user={user}>
            <Routes>
              <Route path="/" element={<HomeDashboard />} />

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

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./components/ToastProvider";
import AppLayout from "./layout/AppLayout";


import Login            from "./pages/Login";
import Dashboard        from "./pages/Dashboard"; 
import StudentDashboard from "./pages/StudentDashboard";
import Alunos           from "./pages/Alunos";
import Professores      from "./pages/Professores";
import TurmasAdmin      from "./pages/TurmasAdmin";
import Vinculos         from "./pages/Vinculos";
import Avaliacoes       from "./pages/Avaliacoes";

// 1. Proteção de rotas privadas
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="p-4">Carregando...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// 2. Proteção de rotas públicas
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

// --- LINHA 39: INÍCIO DAS ROTAS ---
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
=======
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <AppLayout user={user} />
          </PrivateRoute>
        }
      >
>>>>>>> e559ba33e1095ab034618e9bc48b844179846677
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

<<<<<<< HEAD

// 4. Componente Principal
=======
>>>>>>> e559ba33e1095ab034618e9bc48b844179846677
export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <ToastProvider>
<<<<<<< HEAD
          {/* Limpamos os conflitos do Git e mantivemos a versão estável */}
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
=======
          <BrowserRouter>
>>>>>>> e559ba33e1095ab034618e9bc48b844179846677
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </UIProvider>
    </AuthProvider>
  );
}