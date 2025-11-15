"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import {
  Building,
  PlusCircle,
  List,
  Clock,
  CheckCircle,
  Loader2,
  FileText,
} from "lucide-react";

/**
 * Dashboard.tsx
 *
 * Student dashboard (blue premium theme) — glass-morphism layout,
 * shows counts, quick actions and recent requests. Matches RequestStatus style.
 *
 * Drop this file into your project and import `<Dashboard />` at /dashboard route.
 */

type RequestRecord = {
  id: string;
  created_at?: string;
  category?: string;
  problem?: string;
  status?: string;
  priority?: string;
  progress?: number;
  building?: string;
  roomNo?: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setUserLoading(true);
      try {
        const {
          data: { user: u },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("getUser error:", error);
          setUser(null);
        } else {
          setUser(u ?? null);
        }
      } catch (err) {
        console.error("Unexpected getUser error:", err);
        setUser(null);
      } finally {
        setUserLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    // fetch requests for current user (by user_id)
    const fetchRequests = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg(null);

      try {
        const { data, error } = await supabase
          .from<RequestRecord>("maintenance_requests")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) {
          console.error("Failed to fetch requests:", error);
          setErrorMsg("Failed to load your requests.");
          setRequests([]);
        } else {
          setRequests(data ?? []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setErrorMsg("Something went wrong while loading requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  const counts = requests.reduce(
    (acc, r) => {
      const s = (r.status || "pending").toLowerCase();
      if (s === "pending") acc.pending++;
      else if (s === "in-progress" || s === "in progress") acc.inProgress++;
      else if (s === "completed") acc.completed++;
      else acc.pending++;

      return acc;
    },
    { pending: 0, inProgress: 0, completed: 0 }
  );

  const openNewRequest = () => navigate("/new-request");
  const openAllRequests = () => navigate("/requests");
  const openRequest = (id: string) => navigate(`/request/${id}`);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass-card bg-white/75 backdrop-blur-md rounded-3xl p-8 mb-6 shadow-xl border border-white/40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-700">
                Welcome back{user?.user_metadata?.full_name || user?.user_metadata?.name ? ", " : ""}{" "}
                <span className="text-blue-800">
                  {user?.user_metadata?.full_name ||
                    user?.user_metadata?.name ||
                    ""}
                </span>
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Here is a quick overview of your maintenance requests.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={openNewRequest}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
              >
                <PlusCircle className="w-5 h-5" />
                Create New Request
              </button>

              <button
                onClick={openAllRequests}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-gray-200 text-slate-700 shadow-sm hover:shadow-md transition-all"
              >
                <List className="w-5 h-5 text-slate-600" />
                View All Requests
              </button>
            </div>
          </div>
        </div>

        {/* Quick cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="glass-card rounded-2xl p-6 shadow-lg border border-white/30 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{counts.pending}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Requests awaiting assignment or action.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 shadow-lg border border-white/30 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Loader2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{counts.inProgress}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">Work currently being carried out.</p>
          </div>

          <div className="glass-card rounded-2xl p-6 shadow-lg border border-white/30 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{counts.completed}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">Requests marked completed.</p>
          </div>
        </div>

        {/* Recent requests */}
        <div className="glass-card rounded-2xl p-6 shadow-2xl border border-white/30 mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-800">Recent Requests</h2>
            </div>
            <div className="text-sm text-slate-500">
              {loading ? "Loading..." : `${requests.length} shown`}
            </div>
          </div>

          {loading || userLoading ? (
            <div className="py-8 flex items-center justify-center text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading your requests...
            </div>
          ) : errorMsg ? (
            <div className="py-8 text-center text-rose-600">{errorMsg}</div>
          ) : requests.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              You have not submitted any maintenance requests yet.
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <div
                  key={r.id}
                  onClick={() => openRequest(r.id)}
                  className="cursor-pointer bg-white/80 hover:bg-white/100 transition-all rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-3.5 h-3.5 rounded-full"
                        style={{
                          background:
                            r.priority === "high"
                              ? "#fee2e2"
                              : r.priority === "medium"
                              ? "#fffbeb"
                              : "#ecfdf5",
                          border:
                            r.priority === "high"
                              ? "1px solid #fca5a5"
                              : r.priority === "medium"
                              ? "1px solid #fcd34d"
                              : "1px solid #34d399",
                        }}
                      />
                      <h3 className="font-semibold text-slate-800 text-lg truncate max-w-[48rem]">
                        {r.category ? `${capitalize(r.category)} — ` : ""}
                        {r.problem ? truncateText(r.problem, 70) : "No description"}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {r.created_at ? formatDate(r.created_at) : "-"}
                      {" • "}
                      {r.building ? `${r.building}` : ""}
                      {r.roomNo ? ` • Room ${r.roomNo}` : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium capitalize ${
                        statusClasses(r.status)
                      }`}
                    >
                      {r.status ?? "pending"}
                    </span>
                    <div className="text-slate-400">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer small note */}
        <div className="text-center text-xs text-slate-400">
          Tip: Click any request to view full details and confirm completion.
        </div>
      </div>
    </div>
  );
}

/* ---------------------- Helpers ---------------------- */

function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function truncateText(s?: string, len = 80) {
  if (!s) return "";
  return s.length > len ? s.slice(0, len - 1).trim() + "…" : s;
}

function capitalize(s?: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function statusClasses(status?: string) {
  const s = (status || "pending").toLowerCase();
  if (s === "completed") return "bg-green-100 text-green-700 border border-green-200";
  if (s === "in-progress" || s === "in progress") return "bg-blue-100 text-blue-700 border border-blue-200";
  if (s === "pending") return "bg-amber-100 text-amber-700 border border-amber-200";
  return "bg-gray-100 text-gray-700 border border-gray-200";
}
