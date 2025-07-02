import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function RedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const user = session.user;

          const adminEmails = [
            "f20231187@hyderabad.bits-pilani.ac.in",
            // Add more admin emails here
          ];
      const allowedDomain = "hyderabad.bits-pilani.ac.in";
      if (!user.email || !user.email.endsWith(`@${allowedDomain}`)) {
        alert("Only BITS Hyderabad accounts are allowed.");
        supabase.auth.signOut();  // force logout
        return;
      }

          if (user?.email && adminEmails.includes(user.email)) {
            console.log("🛠️ Admin signed in:", user.email);
            navigate("/AdminDashboard");
          } else {
            console.log("🧑‍🔧 Student signed in:", user.email);
            navigate("/MaintenancePortal");
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h1 className="mt-4 text-2xl font-semibold text-gray-700">Finalizing your login...</h1>
        <p className="text-gray-500">Please wait, we're redirecting you.</p>
      </div>
    </div>
  );
}
