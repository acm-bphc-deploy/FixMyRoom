import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MaintenanceSelection from "./MaintenanceSelection";
import ElectricianPage from "./electrician";
import PlumberPage from "./plumber";
import CarpenterPage from "./carpenter";
import History from "./history";


export default function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<MaintenanceSelection />} />
        <Route path="/electrician" element={<ElectricianPage />} />
        <Route path="/plumber" element={<PlumberPage />} />
        <Route path="/carpenter" element={<CarpenterPage />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}
