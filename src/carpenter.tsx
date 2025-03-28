import { useState } from "react";
import { supabase } from "./supabaseClient"; // Import Supabase

export default function CarpenterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hostel, setHostel] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [issue, setIssue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Insert data into Supabase
    const { data, error } = await supabase.from("carpenter_requests").insert([
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
      <form
        onSubmit={handleSubmit}
        style={{ display: "inline-block", textAlign: "left", maxWidth: "400px", width: "100%" }}
      >
        <div id="div1" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>1) Name:</strong></label><br />
          <input
            type="text"
            name="name"
            style={{ width: "100%", padding: "5px" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div id="div2" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>2) BITS Mail:</strong></label><br />
          <input
            type="email"
            name="email"
            style={{ width: "100%", padding: "5px" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div id="div3" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>3) Hostel:</strong></label><br />
          <select
            name="hostel"
            style={{ width: "100%", padding: "5px" }}
            value={hostel}
            onChange={(e) => setHostel(e.target.value)}
            required
          >
            <option value="">Select Hostel</option>
            <option value="goutham">Gautham Bhavan</option>
            <option value="valmiki">Valmiki Bhavan</option>
            <option value="viswakarma">Viswakarma Bhavan</option>
            <option value="ram">Ram Bhavan</option>
            <option value="krishna">Krishna Bhavan</option>
            <option value="meera">Meera Bhavan</option>
            <option value="malaivya">Malaivya Bhavan</option>
            <option value="gandhi">Gandhi Bhavan</option>
            <option value="budh">Budh Bhavan</option>
          </select>
        </div>

        <div id="div4" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>4) Room Number:</strong></label><br />
          <input
            type="text"
            name="roomNo"
            style={{ width: "100%", padding: "5px" }}
            value={roomNo}
            onChange={(e) => setRoomNo(e.target.value)}
            required
          />
        </div>

        <div id="div5" style={{ marginBottom: "15px", border: "2px solid black", padding: "10px", borderRadius: "5px" }}>
          <label><strong>5) Describe your issue:</strong></label><br />
          <textarea
            name="issue"
            rows="4"
            style={{ width: "100%", padding: "5px" }}
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>Submit</button>
      </form>
    </div>
  );
}
