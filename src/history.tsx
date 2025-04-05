import { useState } from "react";
import { supabase } from "./supabaseClient"; // Adjust import path as needed

interface RequestRecord {
  id: number;
  name: string;
  email: string;
  hostel: string;
  roomNo: string;
  issue: string;
  created_at?: string;
  // Add or remove fields depending on your table structure
}

export default function History() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<RequestRecord[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async () => {
    setIsLoading(true);
    setErrorMsg("");
    setHistory([]);

    try {
      // 1) Fetch electrician requests
      const { data: electricianData, error: electricianError } = await supabase
        .from("electrician_requests")
        .select("*")
        .eq("email", email);

      if (electricianError) {
        throw new Error(`Electrician Error: ${electricianError.message}`);
      }

      // 2) Fetch plumber requests
      const { data: plumberData, error: plumberError } = await supabase
        .from("plumber_requests")
        .select("*")
        .eq("email", email);

      if (plumberError) {
        throw new Error(`Plumber Error: ${plumberError.message}`);
      }

      // 3) Fetch carpenter requests
      const { data: carpenterData, error: carpenterError } = await supabase
        .from("carpenter_requests")
        .select("*")
        .eq("email", email);

      if (carpenterError) {
        throw new Error(`Carpenter Error: ${carpenterError.message}`);
      }

      // Combine all results into one array
      // Optionally, we can tag each record with a 'type' field so the user knows which table it came from
      const combined = [
        ...(electricianData || []).map((item) => ({ ...item, type: "Electrician" })),
        ...(plumberData || []).map((item) => ({ ...item, type: "Plumber" })),
        ...(carpenterData || []).map((item) => ({ ...item, type: "Carpenter" })),
      ];

      // Sort by created_at descending (if you want newest first)
      combined.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });

      setHistory(combined);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", margin: "50px" }}>
      <h1>Maintenance History</h1>
      <p>Enter your BITS mail to view all your past requests:</p>

      {/* Search input */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="email"
          placeholder="BITS mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "8px", width: "250px", marginRight: "10px" }}
        />
        <button
          onClick={handleSearch}
          style={{ padding: "8px 16px", cursor: "pointer", fontSize: "16px" }}
        >
          Search
        </button>
      </div>

      {/* Loading indicator */}
      {isLoading && <p>Loading...</p>}

      {/* Error message */}
      {errorMsg && <p style={{ color: "red" }}>Error: {errorMsg}</p>}

      {/* History results */}
      {!isLoading && history.length > 0 && (
        <div style={{ display: "inline-block", textAlign: "left" }}>
          <h2>Results for: {email}</h2>
          {history.map((record) => (
            <div
              key={`${record.type}-${record.id}`}
              style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
            >
              <p><strong>Type:</strong> {record.type}</p>
              <p><strong>Name:</strong> {record.name}</p>
              <p><strong>Hostel:</strong> {record.hostel}</p>
              <p><strong>Room No:</strong> {record.roomNo}</p>
              <p><strong>Issue:</strong> {record.issue}</p>
              <p><strong>Created At:</strong> {record.created_at || "N/A"}</p>
            </div>
          ))}
        </div>
      )}

      {/* No records found */}
      {!isLoading && !errorMsg && history.length === 0 && email !== "" && (
        <p>No records found for {email}.</p>
      )}
    </div>
  );
}
