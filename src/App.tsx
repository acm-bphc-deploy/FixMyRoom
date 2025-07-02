
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MaintenancePortal from "./maintenance-portal";
import AdminDashboard from "./page.tsx";;
import LoginPage from "./loginpage.tsx";
import RedirectAfterLogin from "./redirect";
import ProtectedRoute from "./ProtectedRoute";




export default function App() {
  return (
    <Router>
      <Routes>
        
      
      <Route path="/" element={<LoginPage />} />
      <Route path="/redirect" element={<RedirectAfterLogin />} />
      <Route
  path="/MaintenancePortal"
  element={
    <ProtectedRoute>
      <MaintenancePortal />
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


      </Routes>
    </Router>
  );
}
