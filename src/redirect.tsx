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
      console.log("👤 Processing user:", user);
      console.log("📧 User email:", user?.email);
      
      if (!user?.email || !user.email.endsWith(`@${allowedDomain}`)) {
        console.log("🚨 REDIRECTING TO LOGIN: Invalid email domain");
        alert("Only BITS Hyderabad accounts are allowed.");
        await supabase.auth.signOut();
        navigate("/");
        return;
      }

      console.log("✅ Email domain valid, checking admin status...");
      if (adminEmails.includes(user.email)) {
        console.log("🛠️ REDIRECTING TO ADMIN: Admin signed in:", user.email);
        navigate("/AdminDashboard");
      } else {
        console.log("🧑‍🔧 REDIRECTING TO PORTAL: Student signed in:", user.email);
        navigate("/MaintenancePortal");
      }
    };

    const tryGetSession = async () => {
      console.log("🔍 Checking for existing session...");
      const { data, error } = await supabase.auth.getSession();
      const session = data.session;
      console.log("📋 Session data:", session);
      console.log("❌ Session error:", error);
      
      if (error) {
        console.error("🚨 REDIRECTING TO LOGIN: Error fetching session:", error.message);
        navigate("/");
        return;
      }

      if (session?.user) {
        console.log("✅ Found existing session, processing user...");
        await handleUserRedirect(session.user);
      } else {
        console.log("⏳ No existing session, waiting for auth state change...");
        // We wait for onAuthStateChange
      }
    };

    tryGetSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Auth event:", event);
        console.log("📋 Auth session:", session);
        
        if (event === "SIGNED_IN" && session?.user) {
          console.log("✅ SIGNED_IN event detected, processing user...");
          await handleUserRedirect(session.user);
        } else if (event === "SIGNED_OUT") {
          console.log("🚪 SIGNED_OUT event, redirecting to login...");
          navigate("/");
        } else {
          console.log("❓ Other auth event or no user in session");
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
