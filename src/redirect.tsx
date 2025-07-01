import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

const RedirectAfterLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      // Step 1: Exchange token from URL hash
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.hash);

      if (exchangeError) {
        console.error("Session exchange failed:", exchangeError.message);
        return;
      }

      // Step 2: Get user info
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching user:", userError);
        return;
      }

      // Step 3: Redirect based on email
      const adminEmails = [
        "f20231291@hyderabad.bits-pilani.ac.in", // your warden/admin
      ];

      if (user.email && adminEmails.includes(user.email)) {
        navigate("/AdminDashboard");
      } else {
        navigate("/MaintenancePortal");
      }
    };

    handleOAuthRedirect();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>Logging you in...</h2>
    </div>
  );
};

export default RedirectAfterLogin;
