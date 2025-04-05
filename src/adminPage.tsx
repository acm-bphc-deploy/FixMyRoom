import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

interface RequestRecord {
  id: number;
  name: string;
  email: string;
  hostel: string;
  roomNo: string;
  issue: string;
  created_at?: string;
  type: string; // "Electrician", "Plumber", or "Carpenter"
}

export default function AdminPage() {
  const [records, setRecords] = useState<RequestRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchRecords = async () => {
    setLoading(true);
    try {
      // Fetch electrician requests
      const { data: elecData, error: elecError } = await supabase
        .from("electrician_requests")
        .select("*");
      if (elecError) throw new Error(elecError.message);

      // Fetch plumber requests
      const { data: plumbData, error: plumbError } = await supabase
        .from("plumber_requests")
        .select("*");
      if (plumbError) throw new Error(plumbError.message);

      // Fetch carpenter requests
      const { data: carpData, error: carpError } = await supabase
        .from("carpenter_requests")
        .select("*");
      if (carpError) throw new Error(carpError.message);

      // Tag records with type and combine them
      const taggedElec = (elecData || []).map((item) => ({ ...item, type: "Electrician" }));
      const taggedPlumb = (plumbData || []).map((item) => ({ ...item, type: "Plumber" }));
      const taggedCarp = (carpData || []).map((item) => ({ ...item, type: "Carpenter" }));

      // Combine all records into one array
      const combined = [...taggedElec, ...taggedPlumb, ...taggedCarp];

      // Optional: Sort by created_at (newest first) if the column exists
      combined.sort((a, b) => {
        const dateA = new Date(a.created_at || "").getTime() || 0;
        const dateB = new Date(b.created_at || "").getTime() || 0;
        return dateB - dateA;
      });

      setRecords(combined);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handlePrint = (record: RequestRecord) => {
    const printWindow = window.open("", "", "width=600,height=400");
    if (printWindow) {
      printWindow.document.write("<html><head><title>Print Record</title></head><body>");
      printWindow.document.write(`<h1>Record Details</h1>`);
      printWindow.document.write(`<p><strong>Type:</strong> ${record.type}</p>`);
      printWindow.document.write(`<p><strong>Name:</strong> ${record.name}</p>`);
      printWindow.document.write(`<p><strong>Email:</strong> ${record.email}</p>`);
      printWindow.document.write(`<p><strong>Hostel:</strong> ${record.hostel}</p>`);
      printWindow.document.write(`<p><strong>Room No:</strong> ${record.roomNo}</p>`);
      printWindow.document.write(`<p><strong>Issue:</strong> ${record.issue}</p>`);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  if (loading) return <p>Loading records...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Admin Page: Maintenance Requests</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Type</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Email</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Hostel</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Room No</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Issue</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Created At</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Print</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={`${record.type}-${record.id}`}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{record.type}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{record.name}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{record.email}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{record.hostel}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{record.roomNo}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{record.issue}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{record.created_at || "N/A"}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                <button onClick={() => handlePrint(record)}>Print</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
