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
    ];
    const allowedDomain = "hyderabad.bits-pilani.ac.in";

    const handleUserRedirect = async (user: any) => {
      if (!user?.email || !user.email.endsWith(`@${allowedDomain}`)) {
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
    };

    const tryGetSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      const session = data.session;
      if (error) {
        console.error("Error fetching session:", error.message);
        navigate("/");
        return;
      }

      if (session?.user) {
        await handleUserRedirect(session.user);
      } else {
        console.log("Waiting for auth state change...");
        // We wait for onAuthStateChange
      }
    };

    tryGetSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event);
        if (event === "SIGNED_IN" && session?.user) {
          await handleUserRedirect(session.user);
        } else if (event === "SIGNED_OUT") {
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
