import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function RedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const finishLogin = async () => {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);

      if (exchangeError) {
        console.error("🔴 Exchange failed:", exchangeError.message);
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("🔴 No user found:", userError?.message);
        return;
      }

      console.log("🟢 Logged in as", user.email);
      navigate("/MaintenancePortal");
    };

    finishLogin();
  }, [navigate]);

  return <div>Logging you in...</div>;
}
