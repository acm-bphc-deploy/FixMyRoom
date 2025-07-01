import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

const Redirect = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const handleLogin = async () => {
      console.log("➡️ redirect called:", window.location.href);

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);

      if (exchangeError) {
        console.error("Session exchange error:", exchangeError.message);
        setErrorMsg(`Session exchange error: ${exchangeError.message}`);
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Get user failed:", userError?.message);
        setErrorMsg("No user returned");
        return;
      }

      console.log("Logged in user:", user.email);

      const admins = ["f20231291@hyderabad.bits-pilani.ac.in"];

      if (admins.includes(user.email ?? "")) {
        navigate("/AdminDashboard");
      } else {
        navigate("/MaintenancePortal");
      }
    };

    handleLogin();
  }, [navigate]);

  return (
    <div style={{ marginTop: "3rem", textAlign: "center" }}>
      <h2>Logging you in...</h2>
      {errorMsg && <p style={{ color: "red" }}>⚠️ {errorMsg}</p>}
    </div>
  );
};

export default Redirect;
