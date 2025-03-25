import { useState } from "react";
import { supabase } from "./supabaseClient"; // Import Supabase

export default function ElectricianPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hostel, setHostel] = useState("Goutham Bhavan");
  const [roomNo, setRoomNo] = useState("");
  const [issue, setIssue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Insert data into Supabase
    const { data, error } = await supabase.from("electrician_requests").insert([
      {
        name,
        email,
        hostel,
        roomNo,
        issue,
      },
    ]);

    if (error) {
      console.error("Error submitting request:", error.message);
    } else {
      alert("Request submitted successfully!");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", margin: "50px" }}>
      <h1>Electrician Issue Form</h1>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left", maxWidth: "400px", width: "100%" }}>
        <div style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>1) Name:</strong></label><br />
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>2) BITS Mail:</strong></label><br />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>3) Hostel:</strong></label><br />
          <select value={hostel} onChange={(e) => setHostel(e.target.value)} required>
            <option value="Goutham Bhavan">Goutham Bhavan</option>
            <option value="Valmiki Bhavan">Valmiki Bhavan</option>
            <option value="Viswakarma Bhavan">Viswakarma Bhavan</option>
            <option value="Ram Bhavan">Ram Bhavan</option>
            <option value="Krishna Bhavan">Krishna Bhavan</option>
            <option value="Meera Bhavan">Meera Bhavan</option>
            <option value="Malaivya Bhavan">Malaivya Bhavan</option>
            <option value="Gandhi Bhavan">Gandhi Bhavan</option>
            <option value="Budh Bhavan">Budh Bhavan</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>4) Room Number:</strong></label><br />
          <input type="text" value={roomNo} onChange={(e) => setRoomNo(e.target.value)} required />
        </div>

        <div style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>5) Describe your issue:</strong></label><br />
          <textarea value={issue} onChange={(e) => setIssue(e.target.value)} rows="4" required></textarea>
        </div>

        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>Submit</button>
      </form>
    </div>
  );
}
