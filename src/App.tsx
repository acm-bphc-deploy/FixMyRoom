import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MaintenanceSelection from "./MaintenanceSelection";

function ElectricianPage() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", margin: "50px" }}>
      <h1>Electrician Issue Form</h1>
      <form style={{ display: "inline-block", textAlign: "left", maxWidth: "400px", width: "100%" }}>
        
        <div id="div1" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>1) Name:</strong></label><br />
          <input type="text" name="name" style={{ width: "100%", padding: "5px" }} required />
        </div>

        <div id="div2" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>2) BITS Mail</strong></label><br />
          <input type="text" name="id" style={{ width: "100%", padding: "5px" }} required />
        </div>

        <div id="div3" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>3) Hostel:</strong></label><br />
          <select name="hostel" style={{ width: "100%", padding: "5px" }} required>
            <option value="goutham">Goutham Bhavan</option>
            <option value="valmiki">Valmiki Bhavan</option>
            <option value="valmiki">Viswakarma Bhavan</option>
            <option value="valmiki">Ram Bhavan</option>
            <option value="valmiki">Krishna Bhavan</option>
            <option value="valmiki">Meera Bhavan</option>
            <option value="valmiki">Malaivya Bhavan</option>
            <option value="valmiki">Gandhi Bhavan</option>
            <option value="valmiki">Budh Bhavan</option>
          </select>
        </div>
        <div id="div2" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>4) Room Number</strong></label><br />
          <input type="text" name="id" style={{ width: "100%", padding: "5px" }} required />
        </div>

        <div id="div4" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>5) Describe your issue:</strong></label><br />
          <textarea name="issue" rows="4" style={{ width: "100%", padding: "5px" }} required></textarea>
        </div>

        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>Submit</button>
      </form>
    </div>
  );
}

function PlumberPage() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", margin: "50px" }}>
      <h1>Plumber Issue Form</h1>
      <form style={{ display: "inline-block", textAlign: "left", maxWidth: "400px", width: "100%" }}>
        
        <div id="div1" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>1) Name:</strong></label><br />
          <input type="text" name="name" style={{ width: "100%", padding: "5px" }} required />
        </div>

        <div id="div2" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>2) BITS Mail</strong></label><br />
          <input type="text" name="id" style={{ width: "100%", padding: "5px" }} required />
        </div>

        <div id="div3" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>3) Hostel:</strong></label><br />
          <select name="hostel" style={{ width: "100%", padding: "5px" }} required>
            <option value="goutham">Goutham Bhavan</option>
            <option value="valmiki">Valmiki Bhavan</option>
            <option value="valmiki">Viswakarma Bhavan</option>
            <option value="valmiki">Ram Bhavan</option>
            <option value="valmiki">Krishna Bhavan</option>
            <option value="valmiki">Meera Bhavan</option>
            <option value="valmiki">Malaivya Bhavan</option>
            <option value="valmiki">Gandhi Bhavan</option>
            <option value="valmiki">Budh Bhavan</option>
          </select>
        </div>
        <div id="div2" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>4) Nearest Room Number</strong></label><br />
          <input type="text" name="id" style={{ width: "100%", padding: "5px" }} required />
        </div>

        <div id="div4" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>5) Describe your issue:</strong></label><br />
          <textarea name="issue" rows="4" style={{ width: "100%", padding: "5px" }} required></textarea>
        </div>

        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>Submit</button>
      </form>
    </div>
  );
}
function CarpenterPage() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", margin: "50px" }}>
      <h1>Carpenter Issue Form</h1>
      <form style={{ display: "inline-block", textAlign: "left", maxWidth: "400px", width: "100%" }}>
        
        <div id="div1" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>1) Name:</strong></label><br />
          <input type="text" name="name" style={{ width: "100%", padding: "5px" }} required />
        </div>

        <div id="div2" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>2) BITS Mail</strong></label><br />
          <input type="text" name="id" style={{ width: "100%", padding: "5px" }} required />
        </div>

        <div id="div3" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>3) Hostel:</strong></label><br />
          <select name="hostel" style={{ width: "100%", padding: "5px" }} required>
            <option value="goutham">Goutham Bhavan</option>
            <option value="valmiki">Valmiki Bhavan</option>
            <option value="valmiki">Viswakarma Bhavan</option>
            <option value="valmiki">Ram Bhavan</option>
            <option value="valmiki">Krishna Bhavan</option>
            <option value="valmiki">Meera Bhavan</option>
            <option value="valmiki">Malaivya Bhavan</option>
            <option value="valmiki">Gandhi Bhavan</option>
            <option value="valmiki">Budh Bhavan</option>
          </select>
        </div>
        <div id="div2" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>4) Room Number</strong></label><br />
          <input type="text" name="id" style={{ width: "100%", padding: "5px" }} required />
        </div>

        <div id="div4" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>5) Describe your issue:</strong></label><br />
          <textarea name="issue" rows="4" style={{ width: "100%", padding: "5px" }} required></textarea>
        </div>

        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>Submit</button>
      </form>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MaintenanceSelection />} />
        <Route path="/electrician" element={<ElectricianPage />} />
        <Route path="/plumber" element={<PlumberPage />} />
        <Route path="/carpenter" element={<CarpenterPage />} />
      </Routes>
    </Router>
  );
}
