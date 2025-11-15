"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import adminEmails from "./config/adminEmails";

export default function RedirectPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const allowedDomain = "hyderabad.bits-pilani.ac.in";

    const handleUserRedirect = async (user: any) => {
      if (!user?.email || !user.email.endsWith(`@${allowedDomain}`)) {
        await supabase.auth.signOut();
        navigate("/");
        return;
      }

      setIsProcessing(false);

      if (adminEmails.includes(user.email)) {
        navigate("/AdminDashboard");
      } else {
        navigate("/dashboard");
      }
    };

    const handleAuthRedirect = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          navigate("/");
          return;
        }

        if (session?.user) {
          await handleUserRedirect(session.user);
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Auth redirect error:", err);
        navigate("/");
      }
    };

    handleAuthRedirect();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await handleUserRedirect(session.user);
      } else if (event === "SIGNED_OUT") {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h1 className="mt-4 text-2xl font-semibold text-gray-700">
          {isProcessing ? "Finalizing your login..." : "Redirecting..."}
        </h1>
        <p className="text-gray-500">Please wait while we process everything.</p>
      </div>
    </div>
  );
}
