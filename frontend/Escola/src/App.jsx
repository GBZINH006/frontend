import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import { ToastProvider } from "./components/ToastProvider";
import AppLayout from "./layout/AppLayout";

import Login            from "./pages/Login";
import Dashboard        from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Students         from "./pages/Students";
import Classes          from "./pages/Classes";
import Enrollments      from "./pages/Enrollments";
import Grades           from "./pages/Grades";
import Teachers         from "./pages/Teachers";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

// Dashboard muda conforme o role
function HomeDashboard() {
  const { user } = useAuth();
  return user?.role === "aluno" ? <StudentDashboard /> : <Dashboard />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/*" element={
        <PrivateRoute>
          <AppLayout>
            <Routes>
              <Route path="/"                element={<HomeDashboard />}  />
              <Route path="/students"        element={<Students />}       />
              <Route path="/teachers"        element={<Teachers />}       />
              <Route path="/classes"         element={<Classes />}        />
              <Route path="/enrollments"     element={<Enrollments />}    />
              <Route path="/my-enrollments"  element={<Enrollments />}    />
              <Route path="/grades"          element={<Grades />}         />
              <Route path="/my-grades"       element={<Grades />}         />
              <Route path="*"               element={<Navigate to="/" replace />} />
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