

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


export default function App() {
  return (
    <Router>
      <Routes>
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


          path="/seeAllRequests/:email"
          element={
            <ProtectedRoute>
              <SeeAllRequests />
            </ProtectedRoute>
          }
        />

        <Route

          path="/AdminDashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />


        <Route path="/request/:id" element={<RequestStatus />} />
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}
