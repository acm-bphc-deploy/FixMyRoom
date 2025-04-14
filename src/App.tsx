import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MaintenancePortal from "./maintenance-portal";
import AdminDashboard from "./page.tsx";;
import LoginPage from "./loginpage.tsx";
import RedirectAfterLogin from "./redirect";




export default function App() {
  return (
    <Router>
      <Routes>
        
      
      <Route path="/" element={<LoginPage />} />
      <Route path="/MaintenancePortal" element={<MaintenancePortal />} />     
      <Route path="/AdminDashboard" element={<AdminDashboard />} />  
      <Route path="/redirect" element={<RedirectAfterLogin />} />


      </Routes>
    </Router>
  );
}
