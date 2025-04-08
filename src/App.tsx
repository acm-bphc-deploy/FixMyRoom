import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MaintenancePortal from "./maintenance-portal";
import AdminDashboard from "./page.tsx";;




export default function App() {
  return (
    <Router>
      <Routes>
        
        
        <Route path="/" element={<MaintenancePortal/>} />
        <Route path="/" element={<AdminDashboard/>} />
        
      </Routes>
    </Router>
  );
}
