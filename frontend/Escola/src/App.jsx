import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UIProvider } from "./context/UIContext";
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
        <Route index element={<HomeDashboard />} />
        <Route path="alunos" element={<Alunos />} />
        <Route path="professores" element={<Professores />} />
        <Route path="turmas-admin" element={<TurmasAdmin />} />
        <Route path="vinculos" element={<Vinculos />} />
        <Route path="avaliacoes" element={<Avaliacoes />} />
        
        <Route path="minhas-turmas" element={<Vinculos />} />
        <Route path="minhas-notas" element={<Avaliacoes />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// 4. Componente Principal
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