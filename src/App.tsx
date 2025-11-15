import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./loginpage.tsx";
import RedirectPage from "./redirect";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Dashboard";
import MaintenancePortal from "./maintenance-portal";
import SeeAllRequests from "./SeeAllRequests";
import RequestStatus from "./RequestStatus";
import AdminDashboard from "./page.tsx";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Redirect from magic link */}
        <Route path="/redirect" element={<RedirectPage />} />

        {/* STUDENT ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/new-request"
          element={
            <ProtectedRoute>
              <MaintenancePortal />
            </ProtectedRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <SeeAllRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/request/:id"
          element={
            <ProtectedRoute>
              <RequestStatus />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTE */}
        <Route
          path="/AdminDashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
