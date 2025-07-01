import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

const Redirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      console.log("💡 redirect.tsx loaded, trying session exchange...");

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);

      if (exchangeError) {
        console.error("❌ Session exchange failed:", exchangeError.message);
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ User fetch failed:", userError?.message);
        return;
      }

      console.log("✅ User:", user.email);

      const adminEmails = ["f20231291@hyderabad.bits-pilani.ac.in"];

      if (adminEmails.includes(user.email ?? "")) {
        console.log("➡️ Redirecting to AdminDashboard");
        navigate("/AdminDashboard");
      } else {
        console.log("➡️ Redirecting to MaintenancePortal");
        navigate("/MaintenancePortal");
      }
    };

    handleRedirect();
  }, [navigate]);

  return <div>Logging you in...</div>;
};

export default Redirect;
