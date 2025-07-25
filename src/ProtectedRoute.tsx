// src/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    (async () => {
      console.log("🛡️ ProtectedRoute: Checking user access...");
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log("🛡️ ProtectedRoute user:", user);
      console.log("🛡️ ProtectedRoute error:", error);
      
      if (error || !user) {
        console.log("🚨 ProtectedRoute: No user found, redirecting to login");
        navigate("/"); // not logged in
        return;
      }

      const allowedDomain = "hyderabad.bits-pilani.ac.in";
      const adminEmails = ["f20231187@hyderabad.bits-pilani.ac.in",
        "f20231291@hyderabad.bits-pilani.ac.in",]; // add more if needed

      if (!user.email?.endsWith(`@${allowedDomain}`)) {
        await supabase.auth.signOut();
        navigate("/");
        return;
      }

      if (adminOnly && !adminEmails.includes(user.email)) {
        navigate("/MaintenancePortal"); // not admin
        return;
      }

      setIsChecking(false); // user passed all checks
    })();
  }, [navigate]);

  if (isChecking) {
    return <div className="p-8 text-center">🔐 Checking access...</div>;
  }

  return <>{children}</>;
}
