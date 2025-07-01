import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

const Redirect = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const handleRedirect = async () => {
      console.log("🌐 Starting session exchange...");

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);

      if (exchangeError) {
        console.error("❌ Session exchange failed:", exchangeError.message);
        setErrorMsg(`Session exchange failed: ${exchangeError.message}`);
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ User fetch failed:", userError?.message);
        setErrorMsg(`User fetch failed: ${userError?.message || "No user found"}`);
        return;
      }

      console.log("✅ Logged in as:", user.email);

      const adminEmails = ["f20231291@hyderabad.bits-pilani.ac.in"];

      if (adminEmails.includes(user.email ?? "")) {
        navigate("/AdminDashboard");
      } else {
        navigate("/MaintenancePortal");
      }
    };

    handleRedirect();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h2>Logging you in...</h2>
      {errorMsg && (
        <div style={{ color: "red", marginTop: "1rem" }}>
          <strong>Error:</strong> {errorMsg}
        </div>
      )}
    </div>
  );
};

export default Redirect;
