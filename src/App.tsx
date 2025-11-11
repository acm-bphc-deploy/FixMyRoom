<<<<<<< HEAD

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MaintenancePortal from "./maintenance-portal";
import AdminDashboard from "./page.tsx";;
import LoginPage from "./loginpage.tsx";
import RedirectPage from "./redirect";
import ProtectedRoute from "./ProtectedRoute";



=======
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MaintenancePortal from "./maintenance-portal";
import AdminDashboard from "./page.tsx";
import LoginPage from "./loginpage.tsx";
import RedirectPage from "./redirect";
import ProtectedRoute from "./ProtectedRoute";
import RequestStatus from "./RequestStatus";
import SeeAllRequests from "./SeeAllRequests.tsx";
>>>>>>> 1fc6e67 (added maint req feature)

export default function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD


=======
>>>>>>> 1fc6e67 (added maint req feature)
        <Route path="/" element={<LoginPage />} />
        <Route path="/redirect" element={<RedirectPage />} />
        <Route
          path="/MaintenancePortal"
          element={
            <ProtectedRoute>
              <MaintenancePortal />
            </ProtectedRoute>
          }
        />

        <Route
<<<<<<< HEAD
=======
          path="/seeAllRequests/:email"
          element={
            <ProtectedRoute>
              <SeeAllRequests />
            </ProtectedRoute>
          }
        />

        <Route
>>>>>>> 1fc6e67 (added maint req feature)
          path="/AdminDashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
<<<<<<< HEAD
        <Route path="*" element={<Navigate to="/" replace />} />

=======
        <Route path="/request/:id" element={<RequestStatus />} />
        <Route path="*" element={<Navigate to="/" replace />} />
>>>>>>> 1fc6e67 (added maint req feature)
      </Routes>
    </Router>
  );
}
