import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; // make sure the path is correct

const RedirectAfterLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      // 1. Exchange URL hash for session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.hash);

      if (exchangeError) {
        console.error("❌ Session exchange failed:", exchangeError.message);
        return;
      }

      // 2. Get logged in user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ Could not get user:", userError?.message);
        return;
      }

      console.log("✅ Logged in as:", user.email);

      // 3. Redirect based on role
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
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h2>Logging you in...</h2>
    </div>
  );
};

export default RedirectAfterLogin;
