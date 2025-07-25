import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function RedirectPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const adminEmails = [
      "f20231187@hyderabad.bits-pilani.ac.in",
      "f20231291@hyderabad.bits-pilani.ac.in",
      // Add more admin emails here
    ];
    const allowedDomain = "hyderabad.bits-pilani.ac.in";

    const handleRedirect = async () => {
      try {
        // First, handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        console.log("Session data:", data);
        console.log("Session error:", error);

        if (error) {
          console.error("Error getting session:", error);
          navigate("/");
          return;
        }

        if (!data.session) {
          console.log("No session found, waiting for auth state change...");
          return; // Let the auth state change listener handle it
        }

        const user = data.session.user;
        console.log("User from session:", user);

        if (!user) {
          console.log("No user in session");
          navigate("/");
          return;
        }

        if (!user.email || !user.email.endsWith(`@${allowedDomain}`)) {
          alert("Only BITS Hyderabad accounts are allowed.");
          await supabase.auth.signOut();
          navigate("/");
          return;
        }

        if (adminEmails.includes(user.email)) {
          console.log("🛠️ Admin signed in:", user.email);
          navigate("/AdminDashboard");
        } else {
          console.log("🧑‍🔧 Student signed in:", user.email);
          navigate("/MaintenancePortal");
        }
        setIsProcessing(false);
      } catch (err) {
        console.error("Error in handleRedirect:", err);
        navigate("/");
      }
    };

    handleRedirect();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        
        if (event === 'SIGNED_IN' && session) {
          const user = session.user;
          console.log("User signed in via auth state change:", user);

          if (!user.email || !user.email.endsWith(`@${allowedDomain}`)) {
            alert("Only BITS Hyderabad accounts are allowed.");
            await supabase.auth.signOut();
            navigate("/");
            return;
          }

          if (adminEmails.includes(user.email)) {
            console.log("🛠️ Admin signed in:", user.email);
            navigate("/AdminDashboard");
          } else {
            console.log("🧑‍🔧 Student signed in:", user.email);
            navigate("/MaintenancePortal");
          }
          setIsProcessing(false);
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h1 className="mt-4 text-2xl font-semibold text-gray-700">
          {isProcessing ? "Finalizing your login..." : "Redirecting..."}
        </h1>
        <p className="text-gray-500">Please wait, we're processing your authentication.</p>
      </div>
    </div>
  );
}
