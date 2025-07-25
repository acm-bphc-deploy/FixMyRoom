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
      alert(`Processing user: ${user?.email || 'No email'}`);
      
      if (!user?.email || !user.email.endsWith(`@${allowedDomain}`)) {
        alert(`REDIRECTING TO LOGIN: Invalid email domain. Email: ${user?.email}, Required domain: @${allowedDomain}`);
        await supabase.auth.signOut();
        navigate("/");
        return;
      }

      alert(`Email domain valid for: ${user.email}`);
      if (adminEmails.includes(user.email)) {
        alert(`REDIRECTING TO ADMIN: Admin user detected: ${user.email}`);
        navigate("/AdminDashboard");
      } else {
        alert(`REDIRECTING TO PORTAL: Student user detected: ${user.email}`);
        navigate("/MaintenancePortal");
      }
    };

    const tryGetSession = async () => {
      alert("Checking for existing session...");
      const { data, error } = await supabase.auth.getSession();
      const session = data.session;
      
      if (error) {
        alert(`REDIRECTING TO LOGIN: Error fetching session: ${error.message}`);
        navigate("/");
        return;
      }

      if (session?.user) {
        alert("Found existing session, processing user...");
        await handleUserRedirect(session.user);
      } else {
        alert("No existing session found, waiting for auth state change...");
        // We wait for onAuthStateChange
      }
    };

    tryGetSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        alert(`Auth event detected: ${event}`);
        
        if (event === "SIGNED_IN" && session?.user) {
          alert("SIGNED_IN event detected, processing user...");
          await handleUserRedirect(session.user);
        } else if (event === "SIGNED_OUT") {
          alert("SIGNED_OUT event, redirecting to login...");
          navigate("/");
        } else {
          alert(`Other auth event: ${event}, Session: ${session ? 'Present' : 'Null'}`);
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
