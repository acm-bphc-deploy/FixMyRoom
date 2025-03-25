import "./MaintenanceSelection.css";
import { useNavigate } from "react-router-dom";


export default function MaintenanceSelection() {
  const navigate = useNavigate();

  const handleSelection = (type: "Electrician" | "Plumber" | "Carpenter" | "History") => {
    navigate(`/${type.toLowerCase()}`); // Uses React Router for navigation
  };

  return (
    <div className="container">
      <div className="box">
        <h1 className="title">What problem do you have?</h1>
        <div className="button-group">
          <button className="btn electrician" onClick={() => handleSelection("Electrician")}>
            Electrician
          </button>
          <button className="btn plumber" onClick={() => handleSelection("Plumber")}>
            Plumber
          </button>
          <button className="btn carpenter" onClick={() => handleSelection("Carpenter")}>
            Carpenter
          </button>
          <button className="btn history" onClick={() => handleSelection("History")}>
            History
          </button>
        </div>
      </div>
      
    </div>
    
  );
}
